import API_URL from "../utils/api";
import axios from "axios";
import { useQuery } from "react-query";

export const addFile = async (fileData) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, fileData);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const handleSearch = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword: keyword },
    });
    return response;
    //
    // console.log(response);
    // const blob = new Blob([response.data], { type: "text/plain" });
    // const url = window.URL.createObjectURL(blob);
    //
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "search_results.txt";
    // link.click();
  } catch (error) {
    console.error("Error:", error);
  }
};
