import { Workspace } from "../models/workspace.model.js"
import type { TPrivileges } from "../types.js"

type CreateWorkspaceTypes = {
   createdBy: string
   workspace: 'main' | 'axonverse'
   _id: string,
}

export class WorkspaceRepository {
   async createWorkspace({_id, workspace,createdBy }:CreateWorkspaceTypes) {
      const privileges:TPrivileges = {
         userId: createdBy,
         role: 'owner'
      }  

      const newWorkspace = new Workspace({
         _id: _id,
         createdBy: createdBy,
         workspace: workspace,
      })
      newWorkspace.privileges.push(privileges);
      
      return await newWorkspace.save();
   }
}