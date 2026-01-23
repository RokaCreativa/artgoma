import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { memo } from "react";

interface SelectorItem {
  id: number;
  name: string;
  value: string;
}

const Selector = memo(
  ({
    setUrlParams,
    items,
    placeholder,
  }: {
    setUrlParams: (value: string) => void;
    items: SelectorItem[];
    placeholder: string;
  }) => {
    return (
      <Select onValueChange={(value) => setUrlParams(value)} name={placeholder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

export default Selector;
