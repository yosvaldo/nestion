import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface EnterCategoryProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function EnterCategory({ value, onChange }: EnterCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const catRes = await api.get("/category");
        setCategories(catRes.data.data);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, []);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Memuat..." : "Pilih Kategori"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Kategori Properti</SelectLabel>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}