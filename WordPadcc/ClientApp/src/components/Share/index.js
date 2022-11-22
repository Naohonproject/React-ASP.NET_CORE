import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./share.css";

const Share = () => {
  const params = useParams();
  const [content, setContent] = useState("");
  useEffect(() => {
    axios
      .get(`/api/notes/${params.id}/share`)
      .then((res) => {
        if (!res.data.status) {
          setContent(res.data.content);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return <p className="content">{content}</p>;
};

export default Share;
