import Review from "./review.js";

const KotZillaReview = {
    email: "KotZilla@gmail.com",
    category: "book",
    title: "Why women kills",
    productName: "Node.js",
    content: "because its annoying",
    rate: 1
}
try {
    const review = new Review(KotZillaReview);
    console.log();
} catch (error) {
    console.error(error);
}
// console.log(User.schema.validate(user));