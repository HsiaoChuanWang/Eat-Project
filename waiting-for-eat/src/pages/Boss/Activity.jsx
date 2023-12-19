import { Button, Card, ScrollShadow } from "@nextui-org/react";
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
    <div className="relative my-16 flex justify-center">
      <Card className="h-4/5 w-2/3 border border-solid border-gray-200 py-12 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)]">
        <ScrollShadow
          size={0}
          hideScrollBar
          className="flex h-[calc(100vh-400px)] w-full justify-center"
        >
          <div
            // className="mt-12"
            dangerouslySetInnerHTML={{ __html: activity.description }}
          ></div>
        </ScrollShadow>
      </Card>

      <Button
        radius="full"
        className="absolute bottom-0 right-16 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
        onClick={() => navigate(`/boss/activityEdit/${companyId}`)}
      >
        編輯
      </Button>
    </div>
  );
}

export default Activity;
