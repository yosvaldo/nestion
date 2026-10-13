import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/configs/api.config";
import { createPropertySchema, type CreatePropertyFormValues } from "@/models/property.model";
import { useDebounce } from "@/hooks/use-debounce";

export function useCreateProperty() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);  
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const debouncedCitySearch = useDebounce(citySearch, 300);
  const cityRef = useRef<HTMLDivElement>(null);

  const methods = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { 
      name: "", city: "", category: "", description: "", 
      rooms: [{ name: "", basePrice: 0, guestCapacity: 2, description: "" }] 
    },
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "rooms" });
  const selectedCity = useWatch({ control: methods.control, name: "city" });

  useEffect(() => {
    let isMounted = true;
    const fetchReferences = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          api.get("/categories"),
          api.get("/properties/all-cities")
        ]);
        if (isMounted) {
          setCategories(catRes.data.data);
          setAllCities(cityRes.data.data);
        }
      } catch {
        if (isMounted) toast.error("Gagal memuat data referensi.");
      }
    };
    fetchReferences();
    return () => { isMounted = false; };
  }, []);

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
    setImageFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreatePropertyFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("categoryId", data.category);
      formData.append("description", data.description);
      formData.append("rooms", JSON.stringify(data.rooms));
      
      imageFiles.forEach(file => formData.append("pictures", file));      
      await api.post("/properties", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Properti berhasil ditambahkan!");
      navigate("/tenant");
    } catch (error) {
      toast.error(isAxiosError(error) ? error.response?.data?.message || "Gagal" : "Gagal menambahkan properti.");
    }
  };

  const filteredCities = allCities.filter(c => c.toLowerCase().includes(debouncedCitySearch.toLowerCase())).slice(0, 50);

  return {
    methods, fields, append, remove, selectedCity, navigate,
    previews, handleImageChange, removeImage, onSubmit,
    categories, cityRef, isCityOpen, setIsCityOpen,
    citySearch, setCitySearch, filteredCities, allCities
  };
}