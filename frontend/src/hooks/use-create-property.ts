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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) return toast.error("Ukuran gambar maksimal 1MB");    
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: CreatePropertyFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("categoryId", data.category);
      formData.append("description", data.description);
      formData.append("rooms", JSON.stringify(data.rooms));
      if (imageFile) formData.append("picture", imageFile);
      
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
    preview, handleImageChange, onSubmit,
    categories, cityRef, isCityOpen, setIsCityOpen,
    citySearch, setCitySearch, filteredCities, allCities
  };
}