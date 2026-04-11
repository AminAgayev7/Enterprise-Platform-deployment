import Link from "next/link";
async function getProduct(id: string) {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        cache: "no-store",
    });

    return res.json();
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = await params;
    const product = await getProduct(rawId);

    return (
        <div
            className="max-w-2xl h-100 items-center flex flex-col justify-center mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
            
            <div className="text-center mt-2">
                <h2 className="font-semibold">Product title: {product.title}</h2>
                <p className="text-gray-500">Product stock: {product.stock}</p>
            </div>
            <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                
            </ul>
            <div className="p-4 border-t mx-8 mt-2">
                <button className="bg-gray-800 text-amber-50 p-2 rounded-md"><Link href={'/dashboard'}>Go to dashboard</Link></button>
            </div>
        </div>
    );
}