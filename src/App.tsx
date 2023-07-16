import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

import { API, Auth } from 'aws-amplify'
import { useState } from "react";
import { MusicComponent } from "./modules/music/components/music.component";

function App({ signOut }: {signOut: () => void}) {
  const [response, setResponse] = useState<Record<string, any> | null>(null);

  async function callApi() {
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestData = {
        headers: {
            Authorization: token,
            "Content-Type": 'application/json'
        }
    }
    try {
    const data = await API.get('awsradubagrincom', '/resume', requestData);
    console.log("data: ", data);
    setResponse(data);
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <View className="App">
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>

      <MusicComponent />
      <Button onClick={callApi}>Call API</Button>

      {response && <Card>{JSON.stringify(response, null, 2)}</Card>}
    </View>
  );
}

export default withAuthenticator(App);