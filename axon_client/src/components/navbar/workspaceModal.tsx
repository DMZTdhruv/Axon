"use client";

import useWorkspaceUtils from "@/app/hooks/useWorkspaceUtils";
import { useWorkspaceStore } from "@/stores/workspace";
import { useState } from "react";
import { FiTrash2, FiEdit, FiShare2, FiStar, FiCopy, FiArchive } from "react-icons/fi";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { MdOutlineCancel } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

const modalOptions = [
  { icon: FiEdit, label: "Rename" },
  { icon: FiShare2, label: "Share" },
  { icon: FiStar, label: "Add to" },
  { icon: FiCopy, label: "Duplicate" },
  { icon: FiArchive, label: "Move to" },
  { icon: FiTrash2, label: "Delete" },
];

interface WorkspaceModalProps {
  workspaceId: string;
  workspaceType: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface INameState {
  openSetNameModal: boolean;
  nameOfBanner: string;
}

const WorkspaceModal = ({ workspaceId, workspaceType, setModal }: WorkspaceModalProps) => {
  const workspace = useWorkspaceUtils();
  const currentWorkspace = workspace.findWorkspace(workspaceId, workspaceType);
  const { updateWorkspaceTitleById, addNewSubWorkspaceById, removeWorkspace } = useWorkspaceStore();

  const [newName, setNewName] = useState<INameState>({
    openSetNameModal: false,
    nameOfBanner: currentWorkspace?.title as string,
  });

  if (!currentWorkspace) return null;

  return (
    <div className="absolute animate-in shadow-2xl fade-in-0 duration-300 px-4 py-2 border-neutral-800 border backdrop-blur-2xl rounded-xl top-0 left-[105%] z-[10] w-[300px] h-auto bg-neutral-950/50">
      <div className="relative  h-full w-full">
        {newName.openSetNameModal && (
          <div className="absolute z-[1] duration-300 rename flex-col top-0 w-[200px] left-[110%]">
            <div className=" bg-neutral-950 border-neutral-800 border backdrop-blur-2xl rounded-lg flex p-2 flex-col gap-2">
              <Input
                placeholder="Enter a new name"
                className="ring-0 border-0 bg-neutral-900 backdrop-blur-md  focus-visible:ring-offset-0 focus-visible:ring-0"
                value={newName.nameOfBanner}
                onChange={(e) => {
                  setNewName((prev) => {
                    return {
                      ...prev,
                      nameOfBanner: e.target.value,
                    };
                  });
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-neutral-900 hover:bg-green-900/50 text-white"
                  onClick={() => {
                    updateWorkspaceTitleById(currentWorkspace._id, newName.nameOfBanner, workspaceType);
                    setModal(() => false);
                  }}
                >
                  Change
                </Button>
                <Button
                  size={"sm"}
                  onClick={() => {
                    setNewName((prev) => {
                      return {
                        ...prev,
                        openSetNameModal: false,
                      };
                    });
                  }}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="py-2">
          <button
            type="button"
            onClick={() => setNewName((prev) => ({ ...prev, openSetNameModal: true }))}
            className="flex group w-full relative items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
          >
            <FiEdit className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Rename</span>
          </button>
          <button
            type="button"
            className="flex group items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
            onClick={() => {
              addNewSubWorkspaceById(currentWorkspace._id, workspaceType);
            }}
          >
            <IoAdd className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Add a new sub workspace</span>
          </button>
          <button
            className="flex w-full group items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
            type="button"
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url).then(() => {
                toast("Link copied to clipboard", {
                  description: url,
                  action: {
                    label: "Open",
                    onClick: () => window.open(url, "_blank"),
                  },
                });
              });
            }}
          >
            <FiShare2 className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Share</span>
          </button>

          <div className="flex group items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors">
            <FiStar className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">
              Move to {currentWorkspace?.workspace === "main" ? "Everything" : "Main"}
            </span>
          </div>
          <div className="flex group items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors">
            <FiCopy className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Duplicate</span>
          </div>
          <div className="flex group items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors">
            <FiArchive className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Move to</span>
          </div>
          <button
            type="button"
            className="flex w-full group items-center gap-3 py-2 px-2 hover:bg-red-800/50 rounded-md cursor-pointer transition-colors"
            onClick={() => removeWorkspace(workspaceId, workspaceType)}
          >
            <FiTrash2 className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Delete</span>
          </button>
          <button
            className="flex group w-full items-center gap-3 py-2 px-2 hover:bg-neutral-800/50 rounded-md cursor-pointer transition-colors"
            type="button"
            onClick={() => setModal(() => false)}
          >
            <MdOutlineCancel className="text-neutral-400 group-active:scale-90 " size={18} />
            <span className="text-sm text-neutral-300">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceModal;
