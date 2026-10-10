import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/configs/api.config";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { editPropertySchema, type EditPropertyFormValues, type PropertyDetailResponse } from "@/models/property.model";
import { useDebounce } from "./use-debounce";

interface CategoryResponse {
  id: string;
  name: string;
}

interface ExtendedPropertyResponse extends PropertyDetailResponse {
  pictures?: { pictureUrl: string }[];
}

export function useEditProperty(id: string | undefined) {
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetailResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [existingPictures, setExistingPictures] = useState<string[]>([]);
  const [deletedPictures, setDeletedPictures] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [deletedRooms, setDeletedRooms] = useState<string[]>([]);

  const [allCities, setAllCities] = useState<string[]>([]);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const debouncedCitySearch = useDebounce(citySearch, 300);
  const cityRef = useRef<HTMLDivElement>(null);

  const methods = useForm<EditPropertyFormValues>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: { rooms: [] }
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "rooms" });
  const selectedCity = useWatch({ control: methods.control, name: "city" });

  const handleDataSuccess = useCallback((data: ExtendedPropertyResponse, catData: CategoryResponse[], cityData: string[]) => {
    setProperty(data);
    setCategories(catData);
    setAllCities(cityData);
    methods.reset({
      name: data.name, city: data.city, category: data.category?.id || "",
      description: data.description, rooms: data.rooms || []
    });
    
    const urls: string[] = [];
    if (data.pictureUrls && data.pictureUrls.length > 0) {
      data.pictureUrls.forEach(pic => {
        urls.push(typeof pic === "string" ? pic : (pic as { pictureUrl: string }).pictureUrl);
      });
    } else if (data.pictures && data.pictures.length > 0) {
      data.pictures.forEach(pic => urls.push(pic.pictureUrl));
    }
    setExistingPictures(urls);
  }, [methods]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [propRes, catRes, cityRes] = await Promise.all([
          api.get(`/properties/${id}`), api.get("/categories"), api.get("/properties/all-cities")
        ]);
        if (isMounted) handleDataSuccess(propRes.data.data, catRes.data.data, cityRes.data.data);
      } catch {
        if (isMounted) { toast.error("Gagal memuat data"); navigate("/tenant"); }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [id, navigate, handleDataSuccess]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setIsCityOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.size <= 1024 * 1024);
    if (validFiles.length < files.length) toast.error("Beberapa gambar ditolak (Maks 1MB)");
    setNewImageFiles(prev => [...prev, ...validFiles]);
    setNewPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (index: number) => {
    setDeletedPictures(prev => [...prev, existingPictures[index]]);
    setExistingPictures(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveRoom = (index: number) => {
    const room = methods.getValues("rooms")[index];
    if (room.id) setDeletedRooms(prev => [...prev, room.id as string]);
    remove(index);
  };

  const updateRooms = async (propertyId: string, rooms: EditPropertyFormValues["rooms"]) => {
    return Promise.all(rooms.map(room => {
      const payload = { name: room.name, basePrice: room.basePrice, guestCapacity: room.guestCapacity, description: room.description };
      return room.id ? api.patch(`/properties/${propertyId}/rooms/${room.id}`, payload) : api.post(`/properties/${propertyId}/rooms`, payload);
    }));
  };

  const onSubmit = async (data: EditPropertyFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name); formData.append("city", data.city);
      formData.append("categoryId", data.category); formData.append("description", data.description);
      newImageFiles.forEach(file => formData.append("pictures", file));
      deletedPictures.forEach(url => formData.append("deletedPictures", url));
      
      await api.patch(`/properties/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      await Promise.all(deletedRooms.map(roomId => api.delete(`/properties/${id}/rooms/${roomId}`)));
      await updateRooms(id!, data.rooms);

      toast.success("Berhasil diperbarui!");
      navigate("/tenant");
    } catch (err) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || "Gagal" : "Gagal memperbarui properti.");
    }
  };

  const filteredCities = allCities.filter(c => c.toLowerCase().includes(debouncedCitySearch.toLowerCase())).slice(0, 50);

  return { 
    methods, fields, append, selectedCity, navigate, loading, property,
    categories, onSubmit, handleImageChange, removeExistingImage, removeNewImage, handleRemoveRoom,
    existingPictures, newPreviews,
    cityRef, isCityOpen, setIsCityOpen, citySearch, setCitySearch, filteredCities, allCities
  };
}