"use client";

import useWorkspaceUtils from "@/app/hooks/useWorkspaceUtils";
import { useEffect, useRef, useState } from "react";
import type { IRoutes } from "@/types";
import WorkspaceTopBar from "./WorkspaceTopBar";
import WorkspaceCover from "./WorkspaceCover";
import dynamic from "next/dynamic";
// import Editor from "../Editor/axon_editor";

const DynamicAxonEditor = dynamic(() => import("@/components/AxonEditor/axonEditor"), {
  ssr: false,
  loading: () => <p className=" py-[20px] px-[50px] animate-pulse">Loading editor</p>,
});

const WorkspaceBanner = ({ workspaceId, workspaceType }: { workspaceId: string; workspaceType: string }) => {
  const { findWorkspace, findRoutes } = useWorkspaceUtils();

  const currentWorkspace = findWorkspace(workspaceId, workspaceType);

  const [folders, setFolders] = useState<IRoutes[]>([]);
  const folderRef = useRef<IRoutes[]>([]);

  const traversePreviousNodes = (node: IRoutes, nodes: IRoutes[]) => {
    const someList: IRoutes[] = [node, ...nodes];
    folderRef.current = someList;
    if (node.parentPageId === null) return;

    const parentNode = findRoutes(node.parentPageId, workspaceType);

    if (parentNode) {
      traversePreviousNodes(parentNode, someList);
    }
  };

  if (currentWorkspace) {
    const demoObject: IRoutes = {
      _id: currentWorkspace._id,
      workspace: currentWorkspace.workspace,
      title: currentWorkspace.title || "untitled",
      parentPageId: currentWorkspace?.parentPageId,
      childPageId: currentWorkspace?.childPageId,
    };
    traversePreviousNodes(demoObject, []);
  }

  useEffect(() => {
    setFolders(() => folderRef.current);
  }, [folderRef, currentWorkspace?.title]);

  if (!currentWorkspace) {
    return <p>The workspace doesn&apos;t exists</p>;
  }

  return (
    <>
      <WorkspaceTopBar currentWorkspace={currentWorkspace} folders={folders} />
      <WorkspaceCover currentWorkspace={currentWorkspace} />

      <DynamicAxonEditor currentWorkspace={currentWorkspace} workspaceId={currentWorkspace._id} />
    </>
  );
};

export default WorkspaceBanner;
