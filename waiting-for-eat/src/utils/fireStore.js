import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

export async function getUserInfoFromFirestore(userId) {
  const userRef = doc(db, "user", userId);
  const UserSnap = await getDoc(userRef);

  if (UserSnap.exists()) {
    const userInfo = UserSnap.data();
    return userInfo;
  } else {
    console.log("Failed to get userInfo!");
  }
}

export async function getCompanyInfoFromFirestore(companyId) {
  const companyRef = doc(db, "company", companyId);
  const companySnap = await getDoc(companyRef);

  if (companySnap.exists()) {
    const companyInfo = companySnap.data();
    return companyInfo;
  } else {
    console.log("Failed to get companyInfo!");
  }
}
