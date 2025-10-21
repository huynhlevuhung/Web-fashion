const products = [
  {
    productName: "Áo hoodie oversize nỉ cotton",
    price: 359000,
    img: [
      "https://images.unsplash.com/photo-1602810318383-e5b9d5e6cbd1",
      "https://images.unsplash.com/photo-1603252111027-3e7b9d4b1a58",
    ],
    tags: ["68ef62d13993bc133136f41c"], // Áo
    quantity: 100,
    remaining: 100,
    description: "Áo hoodie oversize chất nỉ cotton ấm áp, phong cách đường phố năng động.",
    sex: "Unisex",
  },
  {
    productName: "Quần jogger thể thao nam",
    price: 279000,
    img: [
      "https://images.unsplash.com/photo-1618354691625-cbc3f88f35d8",
      "https://images.unsplash.com/photo-1602810318363-8c9b55f6f5a2",
    ],
    tags: ["68ef62d13993bc133136f41d"], // Quần
    quantity: 120,
    remaining: 120,
    description: "Quần jogger nam chất liệu thun lạnh co giãn, phù hợp tập gym và mặc hàng ngày.",
    sex: "Nam",
  },
  {
    productName: "Nón snapback logo thêu",
    price: 189000,
    img: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01",
    ],
    tags: ["68ef62d13993bc133136f41f"], // Nón
    quantity: 150,
    remaining: 150,
    description: "Nón snapback phong cách streetwear, logo thêu nổi bật, chất vải cao cấp.",
    sex: "Unisex",
  },
  {
    productName: "Vớ cổ cao họa tiết vintage",
    price: 69000,
    img: [
      "https://images.unsplash.com/photo-1596464716121-66a4ee484592",
      "https://images.unsplash.com/photo-1618354691683-0f32e3d3e9a5",
    ],
    tags: ["68ef62d13993bc133136f420"], // Vớ
    quantity: 200,
    remaining: 200,
    description: "Vớ cổ cao họa tiết cổ điển, giữ ấm và tạo điểm nhấn thời trang.",
    sex: "Unisex",
  },
  {
    productName: "Bông tai bạc hình lá nhỏ",
    price: 159000,
    img: [
      "https://images.unsplash.com/photo-1588167056543-74e7d5a94da3",
      "https://images.unsplash.com/photo-1590080875832-4c3bdf4a0f42",
    ],
    tags: ["68ef62d13993bc133136f421"], // Trang Sức
    quantity: 80,
    remaining: 80,
    description: "Bông tai bạc 925 hình lá nhỏ, tôn lên nét thanh lịch và tinh tế cho phái nữ.",
    sex: "Nữ",
  },
  {
    productName: "Đồng hồ điện tử thể thao",
    price: 499000,
    img: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
      "https://images.unsplash.com/photo-1612810806611-1a4b2a3f57c5",
    ],
    tags: ["68ef62d13993bc133136f422"], // Đồng Hồ
    quantity: 90,
    remaining: 90,
    description: "Đồng hồ điện tử phong cách thể thao, chống nước, có đèn LED hiển thị giờ.",
    sex: "Nam",
  },
  {
    productName: "Túi tote canvas in hình",
    price: 229000,
    img: [
      "https://images.unsplash.com/photo-1618354691637-fd30c0f19c0e",
      "https://images.unsplash.com/photo-1621626381268-877f9c55b8a8",
    ],
    tags: ["68ef62d13993bc133136f41e"], // Phụ Kiện
    quantity: 130,
    remaining: 130,
    description: "Túi tote vải canvas thân thiện môi trường, in hình nghệ thuật độc đáo.",
    sex: "Unisex",
  },
  {
    productName: "Áo khoác gió chống nước",
    price: 459000,
    img: [
      "https://images.unsplash.com/photo-1600185365483-26d7c4c9f5d1",
      "https://images.unsplash.com/photo-1611078481243-46b5e3b8a51f",
    ],
    tags: ["68ef62d13993bc133136f41c"], // Áo
    quantity: 85,
    remaining: 85,
    description: "Áo khoác gió chống nước, nhẹ, dễ gấp gọn mang theo, phù hợp đi phượt.",
    sex: "Nam",
  },
  {
    productName: "Khăn turban họa tiết Boho",
    price: 99000,
    img: [
      "https://images.unsplash.com/photo-1600180758890-6ec84f5e7634",
      "https://images.unsplash.com/photo-1621786544603-82c2eac5cc9b",
    ],
    tags: ["68ef62d13993bc133136f423"], // Khác
    quantity: 140,
    remaining: 140,
    description: "Khăn turban đa năng phong cách Boho, có thể quấn tóc, cổ hoặc làm phụ kiện túi.",
    sex: "Nữ",
  },
  {
    productName: "Vòng cổ da nam cá tính",
    price: 189000,
    img: [
      "https://images.unsplash.com/photo-1600185365483-26d7c4c9f5d1",
      "https://images.unsplash.com/photo-1618150811564-0b5d1b8b8f2b",
    ],
    tags: ["68ef62d13993bc133136f421"], // Trang Sức
    quantity: 70,
    remaining: 70,
    description: "Vòng cổ da handmade phong cách cá tính, dành cho nam giới yêu thích thời trang mạnh mẽ.",
    sex: "Nam",
  },
  {
  productName: "Vest nam cao cấp form slimfit",
  price: 1299000,
  img: [
    "https://images.unsplash.com/photo-1614289371518-23d9b1a92b52",
    "https://images.unsplash.com/photo-1585914299398-c0c3b3d4db8a",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 50,
  remaining: 50,
  description: "Vest nam cao cấp chất liệu wool pha polyester, form slimfit tôn dáng, phù hợp cho sự kiện sang trọng.",
  sex: "Nam",
},
{
  productName: "Đầm dạ hội cổ chữ V ánh kim",
  price: 1499000,
  img: [
    "https://images.unsplash.com/photo-1601315488849-6b3b22dfb96e",
    "https://images.unsplash.com/photo-1562967914-608f82629710",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 40,
  remaining: 40,
  description: "Đầm dạ hội dài cổ chữ V, vải ánh kim lấp lánh, thiết kế ôm body sang trọng và quyến rũ.",
  sex: "Nữ",
},
{
  productName: "Áo sơ mi trắng cao cấp",
  price: 499000,
  img: [
    "https://images.unsplash.com/photo-1551022372-0bd8f9f7c60e",
    "https://images.unsplash.com/photo-1520975918318-3c4e6ff7b22c",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 80,
  remaining: 80,
  description: "Áo sơ mi trắng nam chất cotton Hàn Quốc cao cấp, bền màu, thoáng mát, dễ phối vest.",
  sex: "Nam",
},
{
  productName: "Đầm suông lụa satin cổ nơ",
  price: 890000,
  img: [
    "https://images.unsplash.com/photo-1580983561371-7c1c5a6c3393",
    "https://images.unsplash.com/photo-1600721503122-c1e6c93d4d3f",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 70,
  remaining: 70,
  description: "Đầm suông lụa satin cổ nơ thanh lịch, phù hợp môi trường công sở hoặc tiệc nhẹ.",
  sex: "Nữ",
},
{
  productName: "Quần tây nam dáng ôm",
  price: 699000,
  img: [
    "https://images.unsplash.com/photo-1583744946564-b52ac3d0438d",
    "https://images.unsplash.com/photo-1583745092206-959a0738f3a9",
  ],
  tags: ["68ef62d13993bc133136f41d"], // Quần
  quantity: 90,
  remaining: 90,
  description: "Quần tây nam cao cấp dáng ôm, chất liệu vải co giãn nhẹ, dễ phối với sơ mi và vest.",
  sex: "Nam",
},
{
  productName: "Váy maxi lụa hai dây",
  price: 999000,
  img: [
    "https://images.unsplash.com/photo-1582213782179-1e96d1fc05c3",
    "https://images.unsplash.com/photo-1594223274512-ad4803739a35",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 60,
  remaining: 60,
  description: "Váy maxi hai dây chất liệu lụa mềm mịn, tôn dáng nữ tính và dịu dàng.",
  sex: "Nữ",
},
{
  productName: "Áo blazer nữ basic",
  price: 799000,
  img: [
    "https://images.unsplash.com/photo-1520975869010-565b93a02c34",
    "https://images.unsplash.com/photo-1618354691549-d3c82f0e38d4",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 75,
  remaining: 75,
  description: "Áo blazer nữ basic form Hàn Quốc, chất vải tuytsi mềm mịn, dễ phối đồ công sở.",
  sex: "Nữ",
},
{
  productName: "Áo vest nữ thời trang công sở",
  price: 899000,
  img: [
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6f9ef",
    "https://images.unsplash.com/photo-1596461404969-9ae70b3d564a",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 65,
  remaining: 65,
  description: "Áo vest nữ cao cấp, form ôm nhẹ, phù hợp diện đi làm hoặc dự sự kiện.",
  sex: "Nữ",
},
{
  productName: "Quần tây nữ lưng cao ống suông",
  price: 649000,
  img: [
    "https://images.unsplash.com/photo-1594938298603-c8148d1a15d3",
    "https://images.unsplash.com/photo-1618354691549-d3c82f0e38d4",
  ],
  tags: ["68ef62d13993bc133136f41d"], // Quần
  quantity: 90,
  remaining: 90,
  description: "Quần tây nữ ống suông lưng cao, giúp tôn dáng và kéo dài đôi chân thon gọn.",
  sex: "Nữ",
},
{
  productName: "Đầm midi cổ vuông tay phồng",
  price: 899000,
  img: [
    "https://images.unsplash.com/photo-1592878904946-b6b8b1f1b8ae",
    "https://images.unsplash.com/photo-1621072159864-42c9b7c179ba",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 50,
  remaining: 50,
  description: "Đầm midi cổ vuông tay phồng nhẹ, phong cách vintage hiện đại, chất vải lụa cao cấp.",
  sex: "Nữ",
},
{
  productName: "Áo sơ mi linen be nhạt",
  price: 549000,
  img: [
    "https://images.unsplash.com/photo-1584916208109-5f51c9b1e15a",
    "https://images.unsplash.com/photo-1578735546514-06b8d3bd52a3",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 100,
  remaining: 100,
  description: "Áo sơ mi linen cao cấp màu be, thấm hút tốt, thích hợp cho thời tiết nóng ẩm.",
  sex: "Nam",
},
{
  productName: "Váy body ren cao cấp tay dài",
  price: 1199000,
  img: [
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6f9ef",
    "https://images.unsplash.com/photo-1596452010917-9106ee0f8e53",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 40,
  remaining: 40,
  description: "Váy body ren tay dài ôm dáng, tôn đường cong quyến rũ, phù hợp dạ tiệc sang trọng.",
  sex: "Nữ",
},
{
  productName: "Áo vest nam hai hàng cúc",
  price: 1399000,
  img: [
    "https://images.unsplash.com/photo-1614289371518-23d9b1a92b52",
    "https://images.unsplash.com/photo-1600185365483-26d7c4c9f5d1",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 45,
  remaining: 45,
  description: "Áo vest nam dáng classic hai hàng cúc, chất liệu wool pha silk mềm mịn, đẳng cấp doanh nhân.",
  sex: "Nam",
},
{
  productName: "Chân váy midi xếp ly cao cấp",
  price: 749000,
  img: [
    "https://images.unsplash.com/photo-1618354691637-fd30c0f19c0e",
    "https://images.unsplash.com/photo-1593020557853-6c668c7d9b84",
  ],
  tags: ["68ef62d13993bc133136f41d"], // Quần
  quantity: 80,
  remaining: 80,
  description: "Chân váy midi xếp ly chất vải chiffon cao cấp, tạo dáng mềm mại nữ tính.",
  sex: "Nữ",
},
{
  productName: "Áo gile nam phối vest",
  price: 599000,
  img: [
    "https://images.unsplash.com/photo-1593032525191-7ec0c8e8f4a5",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6f9ef",
  ],
  tags: ["68ef62d13993bc133136f41c"], // Áo
  quantity: 60,
  remaining: 60,
  description: "Áo gile nam phối vest lịch lãm, tạo phong cách chững chạc và tinh tế cho quý ông.",
  sex: "Nam",
},
{
    productName: "Vest nam cao cấp Hàn Quốc",
    price: 1250000,
    img: [
      "https://images.unsplash.com/photo-1520975922131-dc1e34a9c61b",
      "https://images.unsplash.com/photo-1516822003754-cca485356ecb",
    ],
    tags: ["68ef62d13993bc133136f41c"], // Áo
    quantity: 50,
    remaining: 50,
    description: "Vest nam phong cách Hàn Quốc, form chuẩn sang trọng cho dân công sở.",
    sex: "Nam",
  },
  {
    productName: "Đầm dạ hội quyến rũ ánh kim",
    price: 1890000,
    img: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    ],
    tags: ["68ef62d13993bc133136f41c"], // Áo
    quantity: 30,
    remaining: 30,
    description: "Đầm dạ hội dài ánh kim cao cấp, tôn dáng quyến rũ và sang trọng.",
    sex: "Nữ",
  },
  {
    productName: "Áo sơ mi trắng công sở nam",
    price: 349000,
    img: [
      "https://images.unsplash.com/photo-1602810319663-6d94a9c7b440",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 100,
    remaining: 100,
    description: "Áo sơ mi trắng công sở chất vải cotton lạnh, dễ phối đồ.",
    sex: "Nam",
  },
  {
    productName: "Quần tây âu lịch lãm",
    price: 499000,
    img: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7e10a",
      "https://images.unsplash.com/photo-1618354691373-d850bb0d2f30",
    ],
    tags: ["68ef62d13993bc133136f41d"], // Quần
    quantity: 60,
    remaining: 60,
    description: "Quần tây slim fit cao cấp, thích hợp môi trường công sở và sự kiện.",
    sex: "Nam",
  },
  {
    productName: "Đầm xòe công chúa tay phồng",
    price: 799000,
    img: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      "https://images.unsplash.com/photo-1587814213273-3b77c25d7f9e",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 70,
    remaining: 70,
    description: "Đầm xòe công chúa cổ vuông, tông pastel nữ tính và sang trọng.",
    sex: "Nữ",
  },
  {
    productName: "Áo blazer nữ thanh lịch",
    price: 950000,
    img: [
      "https://images.unsplash.com/photo-1603052875328-9a89d5c5e8a3",
      "https://images.unsplash.com/photo-1621605815971-6af3b6e4a239",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 40,
    remaining: 40,
    description: "Áo blazer nữ form chuẩn, tôn dáng thanh lịch cho dân văn phòng.",
    sex: "Nữ",
  },
  {
    productName: "Áo khoác da nam biker style",
    price: 1190000,
    img: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4b8b8ec",
      "https://images.unsplash.com/photo-1583267744059-1a6f3c6c7b7e",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 45,
    remaining: 45,
    description: "Áo khoác da thật cao cấp, kiểu dáng trẻ trung và năng động.",
    sex: "Nam",
  },
  {
    productName: "Quần jean nữ lưng cao",
    price: 569000,
    img: [
      "https://images.unsplash.com/photo-1612423284934-285f2d0b25e9",
      "https://images.unsplash.com/photo-1583002840958-06d00c28c23b",
    ],
    tags: ["68ef62d13993bc133136f41d"],
    quantity: 80,
    remaining: 80,
    description: "Quần jean nữ lưng cao tôn dáng, co giãn thoải mái.",
    sex: "Nữ",
  },
  {
    productName: "Đầm body ôm dáng dự tiệc",
    price: 990000,
    img: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1614281874830-bd899b94a9a1",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 30,
    remaining: 30,
    description: "Đầm body ôm sát, chất liệu lụa cao cấp, tôn dáng quyến rũ.",
    sex: "Nữ",
  },
  {
    productName: "Áo thun cổ tròn basic cao cấp",
    price: 299000,
    img: [
      "https://images.unsplash.com/photo-1600180758890-bd5b8f6be14d",
      "https://images.unsplash.com/photo-1586281380349-632531db7e2e",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 100,
    remaining: 100,
    description: "Áo thun cotton cao cấp form rộng, dễ phối mọi outfit.",
    sex: "Unisex",
  },
  {
    productName: "Áo len cổ lọ mùa đông",
    price: 459000,
    img: [
      "https://images.unsplash.com/photo-1603808033192-082d7b1ab39b",
      "https://images.unsplash.com/photo-1603791452906-b82b0e0b81fa",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 60,
    remaining: 60,
    description: "Áo len cổ lọ giữ ấm tốt, phong cách tối giản.",
    sex: "Unisex",
  },
  {
    productName: "Set vest nữ công sở",
    price: 1390000,
    img: [
      "https://images.unsplash.com/photo-1603052875328-9a89d5c5e8a3",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 35,
    remaining: 35,
    description: "Set vest nữ công sở thanh lịch, tôn dáng chuyên nghiệp.",
    sex: "Nữ",
  },
  {
    productName: "Quần short kaki nam",
    price: 379000,
    img: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7e10a",
      "https://images.unsplash.com/photo-1600271886759-ecf4d1a9b1ee",
    ],
    tags: ["68ef62d13993bc133136f41d"],
    quantity: 90,
    remaining: 90,
    description: "Quần short kaki năng động, thoáng mát cho ngày hè.",
    sex: "Nam",
  },
  {
    productName: "Áo croptop nữ dệt kim",
    price: 299000,
    img: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8f7f5b40",
      "https://images.unsplash.com/photo-1603203497390-0e205a9627a8",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 70,
    remaining: 70,
    description: "Áo croptop nữ dệt kim co giãn, sexy và cá tính.",
    sex: "Nữ",
  },
  {
    productName: "Vớ nữ ren mỏng quyến rũ",
    price: 129000,
    img: [
      "https://images.unsplash.com/photo-1581165762761-8b7d38db4b13",
      "https://images.unsplash.com/photo-1622253694243-768c4b1d3c3d",
    ],
    tags: ["68ef62d13993bc133136f420"],
    quantity: 120,
    remaining: 120,
    description: "Vớ ren nữ mỏng nhẹ, quyến rũ, phối cùng váy hoặc đầm dự tiệc.",
    sex: "Nữ",
  },
  {
    productName: "Vớ lưới thời trang nữ sexy",
    price: 159000,
    img: [
      "https://images.unsplash.com/photo-1560986754-9cb52983f29f",
      "https://images.unsplash.com/photo-1620216314494-22b7d875d73d",
    ],
    tags: ["68ef62d13993bc133136f420"],
    quantity: 90,
    remaining: 90,
    description: "Vớ lưới mảnh thời trang, mang lại vẻ quyến rũ tinh tế.",
    sex: "Nữ",
  },
  {
    productName: "Áo hoodie unisex phong cách streetwear",
    price: 499000,
    img: [
      "https://images.unsplash.com/photo-1603252111027-3e7b9d4b1a58",
      "https://images.unsplash.com/photo-1602810318383-e5b9d5e6cbd1",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 100,
    remaining: 100,
    description: "Áo hoodie form rộng chất nỉ cotton, phong cách đường phố trẻ trung.",
    sex: "Unisex",
  },
  {
    productName: "Áo sơ mi lụa nữ cao cấp",
    price: 589000,
    img: [
      "https://images.unsplash.com/photo-1593032457869-6c64d3c7a77b",
      "https://images.unsplash.com/photo-1600185365159-3ebd6a7a1a0e",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 55,
    remaining: 55,
    description: "Áo sơ mi nữ chất lụa mềm mịn, thoáng nhẹ, sang trọng.",
    sex: "Nữ",
  },
  {
    productName: "Đầm body ren trắng tinh khôi",
    price: 899000,
    img: [
      "https://images.unsplash.com/photo-1606206294170-bc67b3ad63e3",
      "https://images.unsplash.com/photo-1600185365986-8f6f2a3b11c4",
    ],
    tags: ["68ef62d13993bc133136f41c"],
    quantity: 45,
    remaining: 45,
    description: "Đầm body ren trắng sang trọng, tôn đường cong và quyến rũ.",
    sex: "Nữ",
  },
  {
    productName: "Quần tây nữ công sở dáng suông",
    price: 579000,
    img: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
      "https://images.unsplash.com/photo-1618354691373-d850bb0d2f30",
    ],
    tags: ["68ef62d13993bc133136f41d"],
    quantity: 65,
    remaining: 65,
    description: "Quần tây nữ suông cao cấp, dễ phối áo sơ mi hoặc blazer.",
    sex: "Nữ",
  },
];

export default products;
