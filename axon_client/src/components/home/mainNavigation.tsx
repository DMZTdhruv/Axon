"use client";

import { useWorkspaceStore } from "@/stores/workspace";

const MainNavigation = () => {
  const mainWorkspaces = useWorkspaceStore();
  return (
    <div className="p-[40px] space-y-[20px]">
      <h2 className="font-bold text-[18px]">Navigate easily to any page here</h2>
      <div className="flex gap-[20px] flex-col">
        <div className="flex flex-col gap-[10px]">
          <p className="text-[#595959] text-[13px]">Main</p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[#595959] text-[13px]">Everything</p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[#595959] text-[13px]">Recently visited</p>
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
