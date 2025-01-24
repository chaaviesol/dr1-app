import { AntDesign, Entypo,FontAwesome6 } from "@expo/vector-icons";

export const icons = {
  home: (props) => <AntDesign name="home" size={20} {...props} />,
  labs: (props) => <Entypo name="lab-flask" size={20} {...props} />,
  pharmacy: (props) => <Entypo name="shop" size={20} {...props} />,
  profile: (props) => <FontAwesome6 name="circle-user" size={20} {...props} />,
};
