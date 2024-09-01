import { SheetProvider } from "@/hooks/useSheet";
import Sheet from "@/components/Sheet";
import "@/assets/css/index.css";

const SheetDetail = () => {
  return (
    <SheetProvider>
      <Sheet />
    </SheetProvider>
  );
};

export default SheetDetail;
