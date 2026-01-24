import React from "react";
import QrGeneratorPro from "./QrGeneratorPro";
import { getCollaborators } from "@/queries/getCollaborators";
import { unstable_noStore as noStore } from "next/cache";
import getActiveEvents from "@/queries/getActiveEvents";

const QrGenerator = async () => {
  noStore();
  const collaborators = await getCollaborators();
  const events = await getActiveEvents();

  return <QrGeneratorPro collaborators={collaborators} events={events} />;
};

export default QrGenerator;
