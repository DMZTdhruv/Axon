import { AxonError } from "@/types";
import axios from "axios";
import { toast } from "sonner";

type PushToWorkspace = {
   currentWorkspaceId: string;
   toWorkspaceId: string;
   toWorkspaceType: "axonverse" | "main";
};

const pushWorkspace = async ({ currentWorkspaceId, toWorkspaceId, toWorkspaceType }: PushToWorkspace) => {
   try {
      const response = await axios.post("http://localhost:3001/api/workspace/push/transaction", {
         currentWorkspaceId, toWorkspaceId, toWorkspaceType
      }, {
         withCredentials: true
      })

      console.log(response.data)
   } catch (error) {
      const axonError = error as AxonError;
      // console.log(axonError.response?.data.message);
      toast.error("Failed to push workspace", {
         description: `Error: ${axonError.response?.data.message || axonError.message}`,
         className: "bg-neutral-900 border border-neutral-800",
         action: {
            label: "Close",
            onClick: () => console.log("closed error notification"),
         },
      });

   }
}

const usePushWorkspace = () => {
   return pushWorkspace;
}

export default usePushWorkspace