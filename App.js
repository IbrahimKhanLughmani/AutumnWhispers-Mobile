import './polyfills.js';
import 'react-native-gesture-handler';
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from  "react-native-splash-screen";
import SplashCheckScreen from './src/screens/SplashCheckScreen';
import VideoScreen from './src/screens/VideoScreen';
import SignupScreen from './src/screens/Authentication/SignupScreen';
import SigninScreen from './src/screens/Authentication/SigninScreen';
import ForgetPassScreen from './src/screens/Authentication/ForgetPassScreen';
import ResetPassVerification from './src/screens/Authentication/ResetPassVerification';
import ResetPassScreen from './src/screens/Authentication/ResetPassScreen';
import HomeScreen from './src/screens/HomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import MailScreen from './src/screens/MailScreen.js';
import AccountScreen from './src/screens/Accounts/AccountScreen';
import EditAccountScreen from './src/screens/Accounts/EditAccountScreen';
import InvitationScreen from './src/screens/Accounts/InvitationScreen';
import LivenessDetection from './src/screens/Accounts/LivenessDetection.js';
import ContactusScreen from './src/screens/Accounts/ContactusScreen.js';
import VerifyDetectionScreen from './src/screens/VerifyDetectionScreen';
import AboutScreen from './src/screens/Accounts/AboutScreen';
import AlbumScreen from './src/screens/album/AlbumScreen';
import AlbumInfoScreen from './src/screens/album/AlbumInfoScreen.js';
import CreateAlbumScreen from './src/screens/album/CreateAlbumScreen';
import EditAlbumScreen from './src/screens/album/EditAlbumScreen.js';
import AddPhotoScreen from './src/screens/album/AddPhotoScreen';
import ShowPhotosScreen from './src/screens/album/ShowPhotosScreen';
import ShowVideosScreen from './src/screens/album/ShowVideosScreen.js';
import AddVideoScreen from './src/screens/album/AddVideoScreen';
import AddSoundScreen from './src/screens/album/AddSoundScreen';
import AddAudioScreen from './src/screens/album/AddAudioScreen';
import PlayAudioScreen from './src/screens/album/PlayAudioScreen';
import VerificationScreen from './src/screens/Authentication/VerificationScreen.js';
import { Provider as AuthContext } from './src/context/AuthContext';
import { Provider as AlbumContext } from './src/context/AlbumContext';
import { Provider as UserContext } from './src/context/UserContext';
import { Provider as InviteContext } from './src/context/InviteContext'
import {setNavigator} from './src/navigationRef';
import InternetConnectionAlert from "react-native-internet-connection-alert";

const navigator = createStackNavigator(
  {  
    SplashCheck: {
      screen: SplashCheckScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Video: {
      screen: VideoScreen,
      navigationOptions: {
        headerShown: false
      }
    },    
    Signup: {
      screen: SignupScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Signin: {
      screen: SigninScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Verification: {
      screen: VerificationScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Contactus: {
      screen: ContactusScreen,
      navigationOptions: {
        title: ""
      }
    },
    ForgetPass: {
      screen: ForgetPassScreen,
      navigationOptions: {
        title: ""
      }
    },
    ResetPassVer: {
      screen: ResetPassVerification,
      navigationOptions: {
        title: " "
      }
    },
    ResetPass: {
      screen: ResetPassScreen,
      navigationOptions: {
        title: " "
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    VerifyDetection: {
      screen: VerifyDetectionScreen,
      navigationOptions: {
        title: 'Verify' 
      }
    },
    Mail: MailScreen,
    Folder: {
      screen: FolderScreen,
      navigationOptions: {
        headerShown: false
      }
    },    
    Mail: MailScreen,
    Account: {
      screen: AccountScreen,
    },
    EditAccount: {
      screen: EditAccountScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Invitation: InvitationScreen,    
    Liveness: {
      screen: LivenessDetection,
      navigationOptions: {
        title: '' 
      }
    },    
    About: {
      screen: AboutScreen,
      navigationOptions: {
        title: ""
      }
    },
    Album: {
      screen: AlbumScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    AlbumInfo: {
      screen: AlbumInfoScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    CreateAlbum: {
      screen: CreateAlbumScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    EditAlbum: {
      screen: EditAlbumScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    ShowPhotos: ShowPhotosScreen,
    ShowVideos: ShowVideosScreen,
    AddAudio: {
      screen: AddAudioScreen,
      navigationOptions: {
        title: ""
      }
    },
    PlayAudio: {
      screen: PlayAudioScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    AddSound: {
      screen: AddSoundScreen,
      navigationOptions: {
        title: ""
      }
    },
    AddPhoto: {
      screen: AddPhotoScreen,
      navigationOptions: {
        title: ""
      }
    },
    AddVideo: {
      screen: AddVideoScreen,
      navigationOptions: {
        title: ""
      }
    },
  },
  {
    initialRouteName: 'SplashCheck',
    defaultNavigationOptions: {
      // headerShown: false,
    },
  });

const App = createAppContainer(navigator);

export default () => {
  
  React.useEffect(() => {
    SplashScreen.hide();
  });

  return(
    <InternetConnectionAlert
      interval={5000}
      type={'error'}
      onChange={(connectionState) => {
        console.log("Connection State: ", connectionState.isConnected);
      }}>
        <AuthContext>
          <UserContext>
            <AlbumContext>
              <InviteContext>
                <App
                  ref={navigator => {
                    setNavigator(navigator);
                  }}
                />
              </InviteContext>
            </AlbumContext>
          </UserContext>
        </AuthContext>
    </InternetConnectionAlert>
  );
}