import axios from "axios";

const API_URL = "https://api.sendpulse.com";

//get the authentication token
const getToken = async () => {
  const response = await axios.post(`${API_URL}/oauth/access_token`, {
    grant_type: "client_credentials",
    client_id: process.env.SENDPULSE_CLIENT_ID,
    client_secret: process.env.SENDPULSE_CLIENT_SECRET,
  });
  return response.data.access_token;
};

//function to add a user
export const addContactToPulse = async (
  email: string,
  fullName: string,
  location?: string,
  userType?: string,
) => {
  try {
    const token = await getToken();
    const listId = process.env.SENDPULSE_LIST_ID;

    const payload = {
      emails: [
        {
          email: email,
          variables: {
            Name: fullName,
            Location: location,
            UserType: userType,
          },
        },
      ],
    };

    await axios.post(`${API_URL}/addressbooks/${listId}/emails`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`✅ [SendPulse] Added ${email} to list.`);
  } catch (error: any) {
    // log the error
    console.error(
      "❌ [SendPulse Error]",
      error?.response?.data || error.message,
    );
  }
};
