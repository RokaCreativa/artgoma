import { Loader } from "lucide-react";
import AddCollaboratorForm from "./components/addCollaboratorForm";
import { Suspense } from "react";
import QrGenerator from "./components/qrGenerator";

const LoaderQrGenerator = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
};

const GenerateQrPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex  justify-center w-full  bg-white/90 border-2 rounded-2xl border-red-500">
        <Suspense fallback={<LoaderQrGenerator />}>
          <QrGenerator />
        </Suspense>
      </div>
      <div className="flex justify-center w-full  rounded-xl border-red-600 bg-white/90 border-2">
        <AddCollaboratorForm />
      </div>
    </div>
  );
};

export default GenerateQrPage;
