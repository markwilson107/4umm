export async function fetchUserData(username: string) {
  try {
    const response = await fetch("/api/user/data", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
