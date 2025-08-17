import { BASE_URL } from "./firebase";

function getString(fieldObj) {
  return fieldObj?.stringValue ?? "";
}
function getInt(fieldObj) {
  const s = fieldObj?.integerValue ?? "0";
  return Number(s);
}

export function docToUser(doc) {
  const f = doc.fields || {};
  return {
    id: doc.name.split("/").pop(),
    serialNumber: getInt(f.serialNumber),
    userName: getString(f.userName),
    userPassword: getString(f.userPassword),
    userId: getString(f.userId),
    passport: getString(f.passport)
  };
}

export function docToStudent(doc) {
  const f = doc.fields || {};
  return {
    id: doc.name.split("/").pop(),
    serialNumber: getInt(f.serialNumber),
    studentName: getString(f.studentName),
    studentClass: getString(f.studentClass),
    classArm: getString(f.classArm),
    userId: getString(f.userId)
  };
}

function toFieldValue(val) {
  if (val === null || val === undefined) return undefined;
  if (typeof val === "number") return { integerValue: String(val) };
  // if looks like a base64/data url, keep as string
  return { stringValue: String(val) };
}

/** POST a new document */
export async function createDocument(collection, fields) {
  const res = await fetch(`${BASE_URL}/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || res.statusText);
  }
  return data;
}

/** GET all docs in a collection */
export async function listDocuments(collection) {
  const res = await fetch(`${BASE_URL}/${collection}`);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || res.statusText);
  }
  return data.documents || [];
}

/** GET a single document by id (raw) */
export async function getDocument(collection, id) {
  const res = await fetch(`${BASE_URL}/${collection}/${id}`);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || res.statusText);
  }
  return data;
}

/** Update a document using PATCH. data is plain object of values (numbers or strings) */
export async function updateDocument(collection, id, data) {
  const fields = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, toFieldValue(v)]).filter(([_, v]) => v !== undefined)
  );
  const url = `${BASE_URL}/${collection}/${id}`;
  const res = await fetch(url + '?updateMask.fieldPaths=' + Object.keys(fields).join('&updateMask.fieldPaths='), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  const resp = await res.json();
  if (!res.ok || resp.error) {
    throw new Error(resp.error?.message || res.statusText);
  }
  return resp;
}

/** DELETE a document by id */
export async function deleteDocument(collection, id) {
  const res = await fetch(`${BASE_URL}/${collection}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    let msg = res.statusText;
    try { const data = await res.json(); msg = data.error?.message || msg; } catch {}
    throw new Error(msg);
  }
}
