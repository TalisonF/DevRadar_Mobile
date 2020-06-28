import React from "react";
import { View , Text} from "react-native";
import { WebView } from 'react-native-webview';

export default Profile = ({ route,navigation}) =>{
    const url =`https://github.com/${route.params.github_username}`
    console.log(url)
    return <WebView style={{flex: 1}} source={{ uri: url }} />
}