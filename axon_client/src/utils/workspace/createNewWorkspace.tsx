import { useWorkspaceStore } from '@/stores/workspace'
import React from 'react'

interface ICreateNewWorkspaceProps {
    workspaceId: string,
    workspaceType: string
}

const useCreateNewWorkspace = ({workspaceId, workspaceType}: ICreateNewWorkspaceProps) => {
    const {addNewSubWorkspaceById} = useWorkspaceStore();
    const createNewSubWorkspace = () => {

    }
}

export default useCreateNewWorkspace