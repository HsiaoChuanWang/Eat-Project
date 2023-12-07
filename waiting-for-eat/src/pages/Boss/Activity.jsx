import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";

function Activity() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState({});

  useEffect(() => {
    const activitySnap = onSnapshot(doc(db, "company", companyId), (doc) => {
      const data = doc.data();
      setActivity(data);
    });

    return activitySnap;
  }, []);

  return (
    <div className="p-20">
      <button
        onClick={() => {
          navigate(`/boss/activityEdit/${companyId}`);
        }}
        className="absolute right-12 border-2 border-solid border-black"
      >
        編輯
      </button>
      <div dangerouslySetInnerHTML={{ __html: activity.description }}></div>
    </div>
  );
}

export default Activity;
