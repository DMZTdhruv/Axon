import type { AxonError } from "@/types";
import axios from "axios";
import { toast } from "sonner";

export interface CreateSubParentWorkspaceRequest {
   _id: string;
   workspace: "main" | "axonverse";
   createdBy: string;
   parentPageId: string
   removeWorkspace: (
      workspaceId: string,
      workspaceType: "main" | "axonverse",
   ) => void;
}

const createSubParentWorkspace = ({
   _id,
   workspace,
   createdBy,
   parentPageId,
   removeWorkspace,
}: CreateSubParentWorkspaceRequest) => {
   const workspaceData = {
      _id,
      workspace,
      createdBy,
      parentPageId,
   };
   axios
      .post(
         "http://localhost:3001/api/workspace/sub/new",
         workspaceData,
         {
            withCredentials: true,
         },
      )
      .then((data) => {
         console.log(data);
      })
      .catch((error: AxonError) => {
         removeWorkspace(_id, workspace);
         console.error("Error creating workspace:", error.message);
         toast.error("Failed to create new workspace", {
            description: `Failed to create the workspace with id: ${_id}`,
            className: "bg-neutral-900 border border-neutral-800",
            action: {
               label: "Close",
               onClick: () => console.log("closed error notification"),
            },
         });
      });
};

const useCreateNewSubParentWorkspace = () => {
   return { createSubParentWorkspace };
};

export default useCreateNewSubParentWorkspace;
