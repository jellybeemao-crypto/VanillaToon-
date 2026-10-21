
document.addEventListener("DOMContentLoaded", async () => {
  const search = document.getElementById("search");
  const list = document.getElementById("story-list");
  const themeButton = document.getElementById("theme-toggle");
  const categoryButtons = document.querySelectorAll("[data-category]");

  let stories = [];
  let activeCategory = "الكل";

  // المظهر الليلي
  themeButton?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeButton.textContent =
      document.body.classList.contains("dark") ? "☀" : "☾";
  });

  function renderStories() {
    if (!list) return;

    const query = (search?.value || "").trim().toLowerCase();

    const filtered = stories.filter((story) => {
      const matchesSearch =
        (story.title || "").toLowerCase().includes(query) ||
        (story.description || "").toLowerCase().includes(query);

      const category = story.category || "أخرى";
      const matchesCategory =
        activeCategory === "الكل" || category === activeCategory;

      return matchesSearch && matchesCategory;
    });

    if (!filtered.length) {
      list.innerHTML =
        '<p class="empty-state">لا توجد قصص مطابقة حاليًا ♡</p>';
      return;
    }

    list.replaceChildren();

    filtered.forEach((story) => {
      const card = document.createElement("article");
      card.className = "story-card";

      if (story.cover_url) {
        const image = document.createElement("img");
        image.src = story.cover_url;
        image.alt = story.title || "غلاف المانهوا";
        image.loading = "lazy";
        card.appendChild(image);
      }

      const content = document.createElement("div");
      content.className = "story-card-content";

      const title = document.createElement("h3");
      title.textContent = story.title || "قصة بلا عنوان";
      content.appendChild(title);

      const description = document.createElement("p");
      description.textContent = story.description || "حكاية من فانيلا تون";
      content.appendChild(description);

      card.appendChild(content);
      list.appendChild(card);
    });
  }

  search?.addEventListener("input", renderStories);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "الكل";

      categoryButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      renderStories();
    });
  });

  // تحميل القصص العامة من Supabase عند إعداد الاتصال
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (
    !url ||
    !key ||
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {
    list.innerHTML =
      '<p class="empty-state">المكتبة جاهزة للتوصيل بقاعدة البيانات ♡</p>';
    return;
  }

  try {
    const client = window.supabase.createClient(url, key);

    const { data, error } = await client
      .from("manhwa")
      .select("id, title, description, cover_url, visibility")
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (error) throw error;

    stories = data || [];
    renderStories();
  } catch (error) {
    console.error("تعذّر تحميل القصص:", error);
    list.innerHTML =
      '<p class="empty-state">تعذّر تحميل المكتبة. سنتحقق من الاتصال بقاعدة البيانات.</p>';
  }
});
                                
