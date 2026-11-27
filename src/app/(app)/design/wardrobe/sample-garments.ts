// Sample data for the wardrobe design lab (/design/wardrobe) ONLY. Never imported by real
// pages: those show what the backend returns. Photos are the Stitch samples already used in
// /design; colour hex values play the role of the taxonomy's hex hints.

export type SampleGarment = {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  materials: string[];
  colors: Array<{ name: string; hex: string }>;
  image: string;
  draft?: boolean;
};

const photo = (key: string) => `https://lh3.googleusercontent.com/aida-public/${key}`;

export const sampleCategories = ["Outerwear", "Tailoring", "Knitwear", "Trousers", "Footwear", "Shirting"];

export const sampleGarments: SampleGarment[] = [
  {
    id: "1",
    title: "Vicuña Overcoat",
    brand: "Loro Piana",
    category: "Outerwear",
    size: "L",
    materials: ["Vicuña"],
    colors: [{ name: "Camel", hex: "#c19a6b" }],
    image: photo(
      "AB6AXuCpDgY7784LRm8ET83D-ycHZQdAEHqMKqmoXrHbyH7JNkApkPrIDK5Ks341Dx-VAXMPxzIXeT-57GfpKOr8-Y1I5MdMvirval8wfT9oMTewnntzhuHlYez85mtNx7kvW0BHXs6omcR5sp1XcJaFZyfT6BJ9aQAd-m7fSAzc_gLguDuQbX99Ym07CCLgoeohgqcwPUMvptt7JP_f8RSZktPbigUv2SPk9Zn317JDRLQ",
    ),
  },
  {
    id: "2",
    title: "Double-Breasted Blazer",
    brand: "The Row",
    category: "Tailoring",
    size: "50",
    materials: ["Wool"],
    colors: [{ name: "Black", hex: "#1b1c1a" }],
    image: photo(
      "AB6AXuAs8W6wwDs4tDWwWQWeCQ0xC-fUWvAagPgMIyQKrCAN4XGk9N3PAcyXq7lZ18WXmOhaCxGnaPyejvPy4rmuxlq61x9NGcPs6J2N63eanBuYP7aizJXpzmUtcm0YM9j23AP5oD4vdklqJo0K9a3N-LduMWu_wWONw4kYhF9cSJJ_umDvE1Yb5kKoBUu3tf3zbLdFJqirNyxYUb5gob2jlJbNOlw0N7WgKGGO33JtwpU",
    ),
  },
  {
    id: "3",
    title: "Ribbed Cashmere Knit",
    brand: "Margaret Howell",
    category: "Knitwear",
    size: "M",
    materials: ["Cashmere"],
    colors: [{ name: "Ecru", hex: "#e8e2d0" }],
    image: photo(
      "AB6AXuC8kbUdqhdGvd4nbHVlkMflWl3YN4XZcEQbxucCLzYMUfCkAoCzkuM3SQjUkgoqrG5_tVLtymsffYphgqT7F17clLu63GfZc8Y6PtIu5EIkpQ495kCJF1aRmRQ005B2H8R0REZPg6z3FhtVRHcMLvEfV-BRTwHbsoGDUdMVEQiNs9kODGzsK2LLYWKki3y1QlKAC3riT7KPnKRPexf62zbma3NmMSBKAMlOlvyA7bU",
    ),
  },
  {
    id: "4",
    title: "Twisted Volume Chino",
    brand: "Lemaire",
    category: "Trousers",
    size: "32",
    materials: ["Cotton"],
    colors: [{ name: "Olive", hex: "#5b5e45" }],
    image: photo(
      "AB6AXuCSjMYmX2dxXACBKXYUdvZ8aao8OFoTMAD6qIkmlzk3J_ZyR791nNpWyEyDkZNbwVZz0Lojzcve21bE9QHaEdyTf3_c362zrEpkKgR5iZgXCjbGD0gf1e9NEJS0XrcWqPTF5DllPB28WTbhQwxw1qv9Wu7OTYMwKvO8y1a_3GMNKNy9FiTj4xAnqze4aSC93l_fByN0I2y6UVfpcODrr2iIZ4YWM-hKuDrqMUA8xL8",
    ),
  },
  {
    id: "5",
    title: "Cordovan Blucher 990",
    brand: "Alden",
    category: "Footwear",
    size: "43",
    materials: ["Leather"],
    colors: [{ name: "Burgundy", hex: "#5a1f25" }],
    image: photo(
      "AB6AXuArDLyjK8a2DRl5cyw_J7pWYEu5-MwWpaZ0x1zYBphoJnubv1QKzPv9Qi08_2avpUGqP-uAPvYwjjNHz98dDNZY_Ege-O7nsnWzquiYWFT1Xh38UO1PYVV-LH8WfZ_w0kcU9vN_-0kgkKUeNld-HOjPgOKIq254ap4kEwax4F6lm6iycfMHDFwgCJ2MRyLCPXre_yLsPtQ5XuGF4uK4G0CQXKmlMBZN8f2kqdWhlIc",
    ),
  },
  {
    id: "6",
    title: "Washed Linen Overshirt",
    brand: "Brunello Cucinelli",
    category: "Shirting",
    size: "M",
    materials: ["Linen"],
    colors: [{ name: "Sand", hex: "#ddd3c0" }],
    image: photo(
      "AB6AXuCueovIDPl6xrK1DazYaeUag_jkbl0CY3ZopZO1swNMUqRwQ1nXVf_08-zXLEouCLE9oqyIoNbJKCSmcA3psQH7jGdkcKzTHXtq38i-49TVocjICF11b4hEn-URfmgyHz2-ihonNo7TbfgVkGTubR5SREXLkStBLLs_V_cExZg3p-zDeY6-VSFK8yweAmHf81U1e6kPcd4RddgfGDy8FF3jMkJtgMNLzKochDr-7uE",
    ),
  },
  {
    id: "7",
    title: "Peached Cotton Parka",
    brand: "Studio Nicholson",
    category: "Outerwear",
    size: "M",
    materials: ["Cotton", "Polyamide"],
    colors: [
      { name: "Dark olive", hex: "#3f4a35" },
      { name: "Black", hex: "#1b1c1a" },
    ],
    image: photo(
      "AB6AXuA3Mj4_TBxFSPCKJjitVaCB3PKM8h9PJdtZZuUpadZnzjWMuiIvJp3ygerrK2EjLX0ea_wD5xWl-0LWYIyhTxVUlfdJYdOJzST4u5wegJ16sazTVVUOsP1nm1JpfSGMzoTy6-POszQxC-6c9Rfcf7KEmA7TSW5f7tO0IqlnsRzh9gUPcsJP6udyZK8ZndzsrzgH6PH7cGAvj7g_WuQzTdljfTEcmip7ODQoDasZ9vU",
    ),
    draft: true,
  },
  {
    id: "8",
    title: "Raw Japanese Selvedge",
    brand: "A.P.C.",
    category: "Trousers",
    size: "31",
    materials: ["Cotton"],
    colors: [{ name: "Indigo", hex: "#22304f" }],
    image: photo(
      "AB6AXuBT3ger6SxF6IK3Q41R5Qve7wr6DK6dJX_NbNiZex0HwqGPlwgUVeTo9MwJ15Z-Eq6CEH8GxbOD6mQZTcK30APgjITkyd_E7W40Dghu2v95kT5LkMBO-4oqEuQb2hB4wlJT8TzTZkg381ERxu4LNGp6FkcuIihv4OWpc3HkCqiD_hek6ePSS89jDiNR1zol9tCLgMEYRm7nAkat9OSEpyJdC-T1pcOSoMlMGXkQPrQ",
    ),
  },
];
