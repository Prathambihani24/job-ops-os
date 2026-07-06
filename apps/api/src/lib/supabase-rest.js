function assertSupabaseConfig(config) {
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    return null;
  }

  return {
    baseUrl: config.supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey: config.supabaseServiceRoleKey
  };
}

async function request(config, path, options = {}) {
  const supabase = assertSupabaseConfig(config);

  if (!supabase) {
    return null;
  }

  const url = new URL(path, `${supabase.baseUrl}/`);
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: supabase.serviceRoleKey,
      authorization: `Bearer ${supabase.serviceRoleKey}`,
      "content-type": "application/json",
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function listJobApplications(config, limit = 10) {
  return request(
    config,
    `/rest/v1/job_applications?select=*&order=created_at.desc&limit=${limit}`
  );
}

export async function upsertJobApplication(config, application) {
  return request(config, "/rest/v1/job_applications", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
      "Content-Profile": "public",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  });
}

export async function saveResumeProfile(config, profile) {
  return request(config, "/rest/v1/resume_profiles", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
      "Content-Profile": "public",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(profile)
  });
}
