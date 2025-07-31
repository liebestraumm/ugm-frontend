import { FC } from "react";
import { LatestProduct } from "@components/lists/LatestProductList";
import GridView from "@components/grid/GridView";
import ProductCard from "@components/cards/ProductCard";

interface Props {
  data: LatestProduct[];
  onPress(item: LatestProduct): void;
}

const ProductGridView: FC<Props> = ({ data, onPress }) => {
  return (
    <GridView
      data={data}
      renderItem={(item) => <ProductCard product={item} onPress={onPress} />}
    />
  );
};

export default ProductGridView;
