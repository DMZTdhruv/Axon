"use client";

import { useWorkspaceStore, type IUserWorkspace } from "@/stores/workspace";
import Link from "next/link";
import { usePathname } from "next/navigation";
import  { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import WorkspaceModal from "./workspaceModal";
import { IoIosAdd } from "react-icons/io";

const Workspace = ({ workspaceLink }: { workspaceLink: IUserWorkspace }) => {
  const [openFolder, setOpenFolder] = useState<boolean>(false);
  const path = usePathname();
  const isActive = path.includes(workspaceLink._id);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { addNewSubWorkspaceById } = useWorkspaceStore();
  return (
    <div key={workspaceLink._id} className="flex  relative z-[10] flex-col gap-[15px]">
      {/* <div className="absolute top-[-5px] left-[-5px] rounded-lg    bg-[#262626] w-full p-2 h-[29px]" /> */}
      <div
        className={` flex select-none group cursor-pointer items-center justify-between text-[13px] ${isActive ? "opacity-100" : "opacity-60"} hover:opacity-100 transition-all  gap-[10px]`}
      >
        <div className="flex items-center gap-[10px]">
          <div className="relative hover:bg-neutral-900  transition-all rounded-md w-[17px] h-[17px]">
            <img
              width={17}
              height={17}
              className="absolute opacity-100 group-hover:opacity-0 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              src={`/assets/${workspaceLink.icon}`}
              alt={`icon_${workspaceLink.title}`}
            />
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              className={`absolute 
								${openFolder ? "rotate-90" : "rotate-0"}
								opacity-0 group-hover:opacity-100 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
              onClick={() => setOpenFolder((prev) => !prev)}
            >
              <IoIosArrowForward />
            </div>
          </div>
          <Link href={`/workspace/${workspaceLink.workspace}/${workspaceLink._id}`} className="hover:underline">
            {workspaceLink.title
              ? workspaceLink.title.length > 18
                ? `${workspaceLink.title.substring(0, 10)}...`
                : workspaceLink.title
              : "untitled"}
          </Link>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            className="opacity-0 relative active:scale-90 group-hover:opacity-100  hover:bg-neutral-900 p-[3px]  rounded-md"
            onClick={() => {
              addNewSubWorkspaceById(workspaceLink._id, workspaceLink.workspace);
            }}
          >
            <IoIosAdd />
          </button>
          <div className="opacity-0 relative active:scale-90 group-hover:opacity-100 p-[3px] hover:bg-neutral-900  rounded-md">
            <BsThreeDots onClick={() => setOpenModal((prev) => !prev)} />
          </div>
        </div>
      </div>
      {openModal && (
        <WorkspaceModal
          workspaceId={workspaceLink._id}
          setModal={setOpenModal}
          workspaceType={workspaceLink.workspace}
        />
      )}
      {openFolder &&
        (workspaceLink?.subPages && workspaceLink?.subPages?.length !== 0 ? (
          openFolder && (
            <div className="flex   border-l-2 pl-3 border-neutral-800 flex-col gap-[15px]">
              {workspaceLink?.subPages?.map((subPage) => {
                return <WorkspaceFolder key={subPage._id} workspaceLink={subPage} />;
              })}
            </div>
          )
        ) : (
          <p className="text-[13px] pl-3 opacity-35">No pages here</p>
        ))}
    </div>
  );
};

export default Workspace;

const WorkspaceFolder = ({ workspaceLink }: { workspaceLink: IUserWorkspace }) => {
  const [openFolder, setOpenFolder] = useState<boolean>(false);
  const path = usePathname();
  const isActive = path.includes(workspaceLink._id);
  console.log(workspaceLink._id);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { addNewSubWorkspaceById } = useWorkspaceStore();

  return (
    <div className="flex flex-col   gap-[15px]">
      <div
        key={workspaceLink.title}
        className={`flex group cursor-pointer items-center justify-between text-[13px] ${isActive ? "opacity-100" : "opacity-60"} hover:opacity-100 transition-all  gap-[10px]`}
      >
        <div className="flex flex-shrink-0 items-center gap-[10px]">
          <div className="relative w-[17px] h-[17px]">
            <img
              width={17}
              height={17}
              className="absolute opacity-100 group-hover:opacity-0 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              src={`/assets/${workspaceLink.icon}`}
              alt={`icon_${workspaceLink.title}`}
            />
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              className={`absolute 
								${openFolder ? "rotate-90" : "rotate-0"}
								opacity-0 group-hover:opacity-100 transition-all top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
              onClick={() => setOpenFolder((prev) => !prev)}
            >
              <IoIosArrowForward />
            </div>
          </div>
          <Link
            href={`/workspace/${workspaceLink.workspace}/${workspaceLink._id}`}
            className="text-nowrap hover:underline "
          >
            {workspaceLink.title}
          </Link>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            className="opacity-0 relative active:scale-90 group-hover:opacity-100  hover:bg-neutral-900 p-[3px]  rounded-md"
            onClick={() => {
              addNewSubWorkspaceById(workspaceLink._id, workspaceLink.workspace);
            }}
          >
            <IoIosAdd />
          </button>
          <div className="opacity-0 relative active:scale-90 group-hover:opacity-100 p-[3px] hover:bg-neutral-900  rounded-md">
            <BsThreeDots onClick={() => setOpenModal((prev) => !prev)} />
          </div>
        </div>
      </div>
      {openModal && (
        <WorkspaceModal
          workspaceId={workspaceLink._id}
          setModal={setOpenModal}
          workspaceType={workspaceLink.workspace}
        />
      )}
      {openFolder && (
        <div className="flex border-l-2 border-neutral-800 pl-3 gap-[15px] flex-col ">
          {workspaceLink?.subPages && workspaceLink?.subPages?.length !== 0 ? (
            workspaceLink?.subPages?.map((folderName) => {
              return <WorkspaceFolder key={folderName._id} workspaceLink={folderName} />;
            })
          ) : (
            <p className="text-[13px] opacity-35">No pages here</p>
          )}
        </div>
      )}
    </div>
  );
};
