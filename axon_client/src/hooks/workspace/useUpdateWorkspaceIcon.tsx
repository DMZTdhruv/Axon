import type { AxonError, CommonWorkspaceResponse } from "@/types";
import axios from "axios";
import { toast } from "sonner";

type UpdateWorkspaceIconParams = {
   workspaceId: string;
   iconName: string | null;
};

const updateIcon = async ({ workspaceId, iconName }: UpdateWorkspaceIconParams) => {
   try {
      const response = await axios.post<CommonWorkspaceResponse>(
         "http://localhost:3001/api/workspace/icon/transaction",
         {
            workspaceId,
            iconName,
         },
         {
            withCredentials: true,
         }
      );

      console.log(response.data);
      return response.data;
   } catch (error) {
      const axiosError = error as AxonError;
      toast.error("Failed to update the icon", {
         description: `Error: ${axiosError.response?.data.message || "Unknown error"}`,
         className: "bg-neutral-900 border border-neutral-800",
         action: {
            label: "Close",
            onClick: () => console.log("closed error notification"),
         },
      });
   }
};

const useUpdateWorkspaceIcon = () => {
   return {
      updateIcon
   }
}

export default useUpdateWorkspaceIcon