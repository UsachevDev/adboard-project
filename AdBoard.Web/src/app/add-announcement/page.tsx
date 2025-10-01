import { Suspense } from "react";
import AddAnnouncementPage from "./AddAnnouncementPage";

export default function Page() {
  // Можно поставить любой fallback (скелетон/спиннер). null тоже ок.
  return (
    <Suspense fallback={null}>
      <AddAnnouncementPage />
    </Suspense>
  );
}
