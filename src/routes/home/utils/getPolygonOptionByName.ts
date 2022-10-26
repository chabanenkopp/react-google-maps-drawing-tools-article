import { PolygonOptionsType, PolygonType } from "../mapTypes";
import { dropAndReturnElementById } from "./dropAndReturnElementById";

interface Props {
  polygonId: number;
  polygons: PolygonType[];
  name: keyof PolygonOptionsType;
}

export const getPolygonOptionByName = ({
  name,
  polygons,
  polygonId,
}: Props) => {
  const [, currentPolygon] = dropAndReturnElementById({
    id: polygonId,
    elements: polygons,
  });

  return currentPolygon.options[name];
};
