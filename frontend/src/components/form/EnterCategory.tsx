import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react";

export function SelectDemo() {
  const [categories, setCategories] = useState<[]>([]);

  useEffect(() => {
      let isMounted = true;
      const fetchCategory = async () => {
        setLoading(true);
        try {
          const catRes = await api.get(`/properties/${id}`);        
          if (isMounted) {
            setCategories(catRes.data.data);          
            if (catRes.data.data.categories?.length) setSelectedCategoryId(catRes.data.data.rooms[0].id);
            setLoading(false);
          }
        } catch {
          if (isMounted) { setLoading(false); navigate("/error"); }
        }
      };
      return () => { isMounted = false; };
    }, []);


  return (
    <Select categoryId={categoryId}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Kategori</SelectLabel>
          {categoryId.map((categoryId) => (
            <SelectItem key={categoryId.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}