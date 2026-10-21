
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("story-title");
  const chapter = document.getElementById("chapter-title");
  const images = document.getElementById("chapter-images");

  if (!title || !chapter || !images) return;

  // تجهيز صفحة القراءة لاستقبال بيانات الفصل لاحقًا.
  const params = new URLSearchParams(window.location.search);
  const storyName = params.get("title");
  const chapterName = params.get("chapter");

  if (storyName) {
    title.textContent = storyName;
    document.title = storyName + " | Vanilla Toon";
  }

  if (chapterName) {
    chapter.textContent = chapterName;
  }

  // حماية واجهة القراءة من إظهار صفحات وهمية.
  // ستُحمّل صور الفصل بعد ربط قاعدة البيانات.
  const notice = document.createElement("p");
  notice.className = "reader-empty";
  notice.textContent =
    "ستظهر صفحات الفصل هنا بعد ربطه وإضافة صوره.";
  images.replaceChildren(notice);
});
                          
