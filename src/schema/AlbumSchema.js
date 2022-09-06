const AlbumSchema = {
  name: 'Album',
  properties: {
    user_id: 'string',
    fe_album_id: 'string', 
    share: 'string',
    sounds: 'AlbumSounds[]',
    photos: 'AlbumPhotos[]',
    videos: 'AlbumVideos[]',
    // my_memories: 'string',
    // shared_album_id: 'string',
    // shared_date: 'string',
  },
};

export default AlbumSchema;