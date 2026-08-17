const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// ======================================================
// AUTH HEADER
// ======================================================

export const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ======================================================
// CURRENT USER
// ======================================================

export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
};

// ======================================================
// DONORS
// ======================================================

export const getDonors = async () => {
  const response = await fetch(`${API_BASE_URL}/donors`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch donors");
  }

  return data;
};

export const getDonor = async (id) => {
  const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch donor");
  }

  return data;
};

export const createDonor = async (donorData) => {
  const response = await fetch(`${API_BASE_URL}/donors`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(donorData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create donor");
  }

  return data;
};

export const updateDonor = async (id, donorData) => {
  const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(donorData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update donor");
  }

  return data;
};

export const deleteDonor = async (id) => {
  const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete donor");
  }

  return data;
};

// ======================================================
// DONATIONS
// ======================================================

export const getDonations = async () => {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch donations");
  }

  return data;
};

export const getAvailableDonations = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/available`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch available donations");
  }

  return data;
};

export const getDonation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch donation");
  }

  return data;
};

export const createDonation = async (donationData) => {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(donationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create donation");
  }

  return data;
};

export const updateDonation = async (id, donationData) => {
  const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(donationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update donation");
  }

  return data;
};

export const updateDonationStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({
      Status: status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update donation status");
  }

  return data;
};

export const deleteDonation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete donation");
  }

  return data;
};

// ======================================================
// NGOS
// ======================================================

export const getNGOs = async () => {
  const response = await fetch(`${API_BASE_URL}/ngos`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch NGOs");
  }

  const ngos = Array.isArray(data)
    ? data
    : Array.isArray(data.ngos)
      ? data.ngos
      : Array.isArray(data.data)
        ? data.data
        : [];

  return {
    ...data,
    ngos,
  };
};

export const getNGO = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ngos/${id}`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch NGO");
  }

  return data;
};

export const createNGO = async (ngoData) => {
  const response = await fetch(`${API_BASE_URL}/ngos`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(ngoData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create NGO");
  }

  return data;
};

export const updateNGO = async (id, ngoData) => {
  const response = await fetch(`${API_BASE_URL}/ngos/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(ngoData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update NGO");
  }

  return data;
};

export const deleteNGO = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ngos/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete NGO");
  }

  return data;
};

// ======================================================
// CLAIMS
// ======================================================

export const getClaims = async () => {
  const response = await fetch(`${API_BASE_URL}/claims`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch claims");
  }

  return data;
};

export const getClaim = async (id) => {
  const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch claim");
  }

  return data;
};

export const createClaim = async (claimData) => {
  const response = await fetch(`${API_BASE_URL}/claims`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(claimData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create claim");
  }

  return data;
};

export const updateClaim = async (id, claimData) => {
  const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(claimData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update claim");
  }

  return data;
};

export const deleteClaim = async (id) => {
  const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete claim");
  }

  return data;
};

// ======================================================
// DA OUTPUT
// ======================================================

export const getDAOutput = async () => {
  const response = await fetch(`${API_BASE_URL}/da-output`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch DA output");
  }

  return data;
};
