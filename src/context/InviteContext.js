import CreateDataContext from './CreateDataContext';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const inviteReducer = (state, action) => {
  switch (action.type) {
    
    case 'add_joined':
      return {
        joined: action.payload
      }

      default:
        return state
  }
}

const sendInvite = (dispatch) => {
  return async (number) => {
    try {
      await Axios.post('https://autumnwhispers.borderlesssecurity.com/api/invite', {number}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err.response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
const getInvites = (dispatch) => {
  return async () => {
    try {
      await Axios.get('https://autumnwhispers.borderlesssecurity.com/api/invite', {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then((res) => {
        dispatch({
          type: 'add_joined',
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export const { Context, Provider } = CreateDataContext(
  inviteReducer,
  { getInvites, sendInvite },
  [
    {
      joined: [],
    }
  ]
)