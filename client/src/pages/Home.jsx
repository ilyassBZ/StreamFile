import SearchForm from "../components/Search";
import UploadForm from "../components/UploadForm";
import Progress from "../components/Progress";
import { useState } from "react";
const Home = () => {
  const [progress, setProgress] = useState(0);
  return (
    <div className="w-full mt-52 flex justify-center flex-col">
      <UploadForm progress={progress} setProgress={setProgress} />
      <Progress progress={progress} setProgress={setProgress} />
      <SearchForm />
    </div>
  );
};

export default Home;
