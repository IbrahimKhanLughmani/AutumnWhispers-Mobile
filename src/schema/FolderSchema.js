const FolderSchema = {
  name: 'Folder',
  properties: {
    fe_folder_id: 'string',
    user_id: 'string',
    shared_user_id: 'string', 
    shared_user_firstname: 'string',
    shared_user_lastname: 'string',
    shared_user_profile_pic: 'string',
    albums: 'Album[]',
  },
};

export default FolderSchema;