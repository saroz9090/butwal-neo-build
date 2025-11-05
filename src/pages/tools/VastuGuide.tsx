import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, Home, MapPin, DoorOpen, Bed, Utensils, BookOpen, CheckCircle, XCircle, AlertCircle, Menu, X } from "lucide-react";
import { Label } from "@/components/ui/label";

const VastuGuide = () => {
  const [selectedVastuSection, setSelectedVastuSection] = useState("overview");
  const [vastuDirection, setVastuDirection] = useState("");
  const [vastuRecommendation, setVastuRecommendation] = useState<{
    description: string;
    dos: string[];
    donts: string[];
    color: string;
  } | null>(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomRecommendation, setRoomRecommendation] = useState<{
    ideal: string;
    direction: string;
    tips: string[];
    avoid: string[];
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sections"); // "sections", "direction", "room"

  // Vastu Directional Analysis
  const analyzeVastu = () => {
    const recommendations: { [key: string]: { description: string, dos: string[], donts: string[], color: string } } = {
      north: {
        description: "उत्तर दिशा (North direction) is ruled by Kuber, the God of wealth. यसले समृद्धि, आर्थिक वृद्धि, र करियरका अवसरहरू ल्याउँछ। यो दिशा धन र सम्पत्तिको लागि धेरै शुभ मानिन्छ। उत्तर दिशामा ढोका, झ्याल, वा प्रवेशद्वार भएको घरमा धनको प्रवाह निरन्तर रहन्छ।",
        dos: [
          "मुख्य ढोका र बस्ने कोठाको लागि आदर्श (Ideal for main entrance and living rooms)",
          "अध्ययन कोठा र घरका कार्यालयहरूको लागि उत्कृष्ट (Excellent for study rooms and home offices)",
          "एक्वेरियम जस्ता पानीका तत्वहरूको लागि राम्रो (Good for water elements like aquariums)",
          "सेतो, निलो, हरियो जस्ता हल्का रङहरू प्रयोग गर्नुहोस् (Use light colors like white, blue, green)",
          "उत्तर दिशालाई खुला र सफा राख्नुहोस् (Keep north direction open and clean)",
          "यस दिशामा हल्का फर्नीचर मात्र राख्नुहोस् (Place only light furniture in this direction)"
        ],
        donts: [
          "यस दिशामा भारी फर्नीचर राख्नबाट टाढा रहनुहोस् (Avoid heavy furniture in this direction)",
          "उत्तरमा शौचालय वा भान्सा नबनाउनुहोस् (No toilets or kitchen in north)",
          "यस क्षेत्रमा गाढा रङहरू प्रयोग नगर्नुहोस् (Avoid dark colors in this area)",
          "स्टोरेज वा कलर्सले ब्लक नगर्नुहोस् (Don't block with storage or clutter)",
          "उत्तर दिशामा कुनै पनि प्रकारको निर्माण कार्य नगर्नुहोस् (Avoid any construction in north direction)",
          "यस दिशामा झोल वा फोहोर नराख्नुहोस् (Don't keep garbage or waste in this direction)"
        ],
        color: "bg-blue-50 border-2 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700"
      },
      south: {
        description: "दक्षिण दिशा (South direction) is governed by Yama, the God of death. यसले स्थिरता र सुरक्षा प्रदान गर्दछ जब सही तरिकाले संतुलित हुन्छ। दक्षिण दिशा शक्ति र सहनशीलताको प्रतीक हो। यस दिशामा ठूलो भवन वा भारी वस्तुहरू राख्दा घरको स्थिरता बढ्छ।",
        dos: [
          "मास्टर बेडरूम राख्नको लागि उत्तम (Best for master bedroom placement)",
          "भारी फर्नीचर र स्टोरेजको लागि आदर्श (Ideal for heavy furniture and storage)",
          "सीढी र संरचनात्मक समर्थनको लागि राम्रो (Good for staircase and structural support)",
          "रातो, सुन्तला, खैरो जस्ता तातो रङहरू प्रयोग गर्नुहोस् (Use warm colors like red, orange, brown)",
          "दक्षिण दिशामा उचाइ भएको निर्माण गर्नुहोस् (Build elevated structures in south direction)",
          "यस दिशामा तिजोरी र मूल्यवान वस्तुहरू राख्नुहोस् (Keep safe and valuables in this direction)"
        ],
        donts: [
          "दक्षिणमा मुख्य ढोका नबनाउनुहोस् (Avoid main entrance in south)",
          "दक्षिण दिशामा पानीका तत्व वा शौचालय नबनाउनुहोस् (No water elements or bathrooms)",
          "यस क्षेत्रलाई खाली नराख्नुहोस् (Don't keep this area empty)",
          "यस जोनमा हल्का रङहरू प्रयोग नगर्नुहोस् (Avoid light colors in this zone)",
          "दक्षिण दिशामा कुनै पनि प्रकारको खाली स्थान नराख्नुहोस् (Don't leave any empty space in south direction)",
          "यस दिशामा भूमिगत ट्याङ्की वा पानीको स्रोत नबनाउनुहोस् (Avoid underground tanks or water sources in this direction)"
        ],
        color: "bg-red-50 border-2 border-red-300 dark:bg-red-950/30 dark:border-red-700"
      },
      east: {
        description: "पूर्व दिशा (East direction) is ruled by Indra, the King of Gods. यसले स्वास्थ्य, जीवनशक्ति, र आध्यात्मिक वृद्धि ल्याउँछ। पूर्व दिशा सूर्यको दिशा हो र नयाँ सुरुवात, स्वास्थ्य, र समृद्धिको प्रतीक हो। यस दिशाबाट आउने सूर्यको किरणहरूले घरमा सकारात्मक उर्जा ल्याउँछन्।",
        dos: [
          "मुख्य ढोका र प्रार्थना कोठाको लागि परिपूर्ण (Perfect for main entrance and prayer room)",
          "बस्ने कोठा र बाल्कनीहरूको लागि आदर्श (Ideal for living rooms and balconies)",
          "अध्ययन क्षेत्र र भान्साको लागि राम्रो (Good for study areas and kitchens)",
          "हल्का रङहरू प्रयोग गर्नुहोस्, बिहानको सूर्यको प्रकाशलाई अनुमति दिनुहोस् (Use light colors, allow morning sunlight)",
          "पूर्व दिशामा ढोका र झ्यालहरू ठूला बनाउनुहोस् (Make doors and windows large in east direction)",
          "यस दिशामा पूजा कोठा र अध्ययन कोठा राख्नुहोस् (Place prayer room and study room in this direction)"
        ],
        donts: [
          "पूर्व दिशामा शौचालय नबनाउनुहोस् (Avoid toilets in east direction)",
          "कुनै भारी निर्माण वा अवरोध नराख्नुहोस् (No heavy construction or blockage)",
          "गाढा रङहरू प्रयोग नगर्नुहोस् (Don't use dark colors)",
          "पूर्वमा फोहोर भण्डारण नगर्नुहोस् (Avoid storing garbage in east)",
          "पूर्व दिशामा कुनै पनि प्रकारको गन्दगी नराख्नुहोस् (Don't keep any kind of dirt in east direction)",
          "यस दिशामा धुवाँ वा धूलो उत्पादन हुने कार्य नगर्नुहोस् (Avoid activities that produce smoke or dust in this direction)"
        ],
        color: "bg-green-50 border-2 border-green-300 dark:bg-green-950/30 dark:border-green-700"
      },
      west: {
        description: "पश्चिम दिशा (West direction) provides social connections and children's happiness when balanced correctly. यो दिशा रचनात्मकता, मनोरञ्जन, र सामाजिक सम्बन्धहरूको लागि शुभ मानिन्छ। पश्चिम दिशामा राम्रो संरचना भएको घरमा सामाजिक प्रतिष्ठा र सम्मन बढ्छ।",
        dos: [
          "बच्चाहरूको बेडरूमको लागि राम्रो (Good for children's bedrooms)",
          "खाना कक्ष र अध्ययनको लागि आदर्श (Ideal for dining areas and study)",
          "अतिथि कोठाको लागि उपयुक्त (Suitable for guest rooms)",
          "सेतो, पहेंलो, वा हल्का खैरो रङहरू प्रयोग गर्नुहोस् (Use white, yellow, or light gray colors)",
          "पश्चिम दिशामा अध्ययन कोठा र बेडरूम राख्नुहोस् (Place study room and bedrooms in west direction)",
          "यस दिशामा खेलकुद कोठा र मनोरञ्जन क्षेत्र बनाउनुहोस् (Create sports room and entertainment area in this direction)"
        ],
        donts: [
          "पश्चिममा मुख्य ढोका नबनाउनुहोस् (Avoid main entrance in west)",
          "यस दिशामा प्रार्थना कोठा नबनाउनुहोस् (No prayer room in this direction)",
          "पश्चिमतिर निर्माण विस्तार नगर्नुहोस् (Don't extend construction westward)",
          "रातो र कालो रङहरूबाट टाढा रहनुहोस् (Avoid red and black colors)",
          "पश्चिम दिशामा भारी मशीनहरू वा उपकरणहरू नराख्नुहोस् (Don't keep heavy machines or equipment in west direction)",
          "यस दिशामा कुनै पनि प्रकारको अपशुभ वस्तु नराख्नुहोस् (Avoid keeping any inauspicious objects in this direction)"
        ],
        color: "bg-yellow-50 border-2 border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-700"
      },
      northeast: {
        description: "ईशान कोण (Northeast direction) is the most sacred direction, ruled by Shiva. यसले दिव्य आशीर्वाद र समग्र समृद्धि ल्याउँछ। ईशान कोणलाई सबैभन्दा पवित्र दिशा मानिन्छ र यसको उचित देखभालले जीवनमा सकारात्मकता ल्याउँछ। यो दिशा जल तत्वको प्रतिनिधित्व गर्दछ।",
        dos: [
          "प्रार्थना र ध्यान कोठाको लागि परिपूर्ण (Perfect for prayer and meditation room)",
          "सम्भव भए मुख्य ढोकाको लागि आदर्श (Ideal for main entrance if possible)",
          "सफा, खुला र उच्च राख्नुहोस् (Keep clean, open and elevated)",
          "सेतो, हल्का निलो, केसरी रङहरू प्रयोग गर्नुहोस् (Use white, light blue, saffron colors)",
          "ईशान कोणमा तुलसी कोठा र पूजा स्थल बनाउनुहोस् (Create Tulsi temple and worship place in northeast)",
          "यस दिशामा स्वच्छ पानीको स्रोत राख्नुहोस् (Keep source of clean water in this direction)"
        ],
        donts: [
          "कहिल्यै यहाँ शौचालय नबनाउनुहोस् (Never place toilets here)",
          "भान्सा वा आगोका तत्वहरू नराख्नुहोस् (No kitchen or fire elements)",
          "भारी फर्नीचर वा स्टोरेजबाट टाढा रहनुहोस् (Avoid heavy furniture or storage)",
          "गाढा रङहरू प्रयोग नगर्नुहोस् (Don't use dark colors)",
          "ईशान कोणमा कुनै पनि प्रकारको नकारात्मक वस्तु नराख्नुहोस् (Don't keep any negative objects in northeast)",
          "यस दिशामा कुनै पनि प्रकारको गन्दगी वा फोहोर नराख्नुहोस् (Avoid keeping any dirt or waste in this direction)"
        ],
        color: "bg-purple-50 border-2 border-purple-300 dark:bg-purple-950/30 dark:border-purple-700"
      },
      northwest: {
        description: "वायव्य कोण (Northwest direction) is ruled by Vayu, the God of wind. यसले सम्बन्धहरू र यात्राहरूलाई प्रभावित गर्दछ। यो दिशा वायु तत्वको प्रतिनिधित्व गर्दछ र यसको उचित प्रबन्धले जीवनमा गतिशीलता र परिवर्तन ल्याउँछ।",
        dos: [
          "अतिथि बेडरूमको लागि राम्रो (Good for guest bedrooms)",
          "स्टोरेज र पार्किंगको लागि आदर्श (Ideal for storage and parking)",
          "छोरीको बेडरूमको लागि उपयुक्त (Suitable for daughter's bedroom)",
          "खैरो, सेतो, वा हल्का रङहरू प्रयोग गर्नुहोस् (Use gray, white, or light colors)",
          "वायव्य कोणमा अतिथि कोठा र भण्डारण कोठा बनाउनुहोस् (Create guest room and storage room in northwest)",
          "यस दिशामा हावापानीको उचित प्रबन्ध गर्नुहोस् (Manage proper ventilation in this direction)"
        ],
        donts: [
          "प्रार्थना कोठा राख्नबाट टाढा रहनुहोस् (Avoid prayer room placement)",
          "यहाँ कुनै भारी निर्माण नगर्नुहोस् (No heavy construction here)",
          "वायव्यमा भान्सा नराख्नुहोस् (Don't place kitchen in northwest)",
          "रातो र कालो रङहरूबाट टाढा रहनुहोस् (Avoid red and black colors)",
          "वायव्य कोणमा कुनै पनि प्रकारको जल तत्व नराख्नुहोस् (Don't keep any water elements in northwest)",
          "यस दिशामा कुनै पनि प्रकारको रोकावट नबनाउनुहोस् (Avoid creating any obstacles in this direction)"
        ],
        color: "bg-gray-50 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
      },
      southeast: {
        description: "आग्नेय कोण (Southeast direction) is ruled by Agni, the Fire God. यो आगोसम्बन्धी गतिविधिहरूको लागि आदर्श हो। यो दिशा अग्नि तत्वको प्रतिनिधित्व गर्दछ र यसको उचित प्रबन्धले जीवनमा उर्जा र उत्साह ल्याउँछ।",
        dos: [
          "भान्सा राख्नको लागि परिपूर्ण (Perfect for kitchen placement)",
          "विद्युतीय उपकरणहरूको लागि राम्रो (Good for electrical equipment)",
          "बोइलर र जेनरेटरहरूको लागि आदर्श (Ideal for boilers and generators)",
          "रातो, सुन्तला, वा गुलाबी रङहरू प्रयोग गर्नुहोस् (Use red, orange, or pink colors)",
          "आग्नेय कोणमा भान्सा र विद्युत उपकरणहरू राख्नुहोस् (Place kitchen and electrical appliances in southeast)",
          "यस दिशामा अग्नि सम्बन्धी सबै कार्यहरू गर्नुहोस् (Perform all fire-related activities in this direction)"
        ],
        donts: [
          "यहाँ प्रार्थना कोठा नबनाउनुहोस् (Avoid prayer room here)",
          "आग्नेयमा शौचालय नबनाउनुहोस् (No toilets in southeast)",
          "पानीका तत्वहरू नराख्नुहोस् (Don't place water elements)",
          "निलो र कालो रङहरूबाट टाढा रहनुहोस् (Avoid blue and black colors)",
          "आग्नेय कोणमा कुनै पनि प्रकारको जल स्रोत नबनाउनुहोस् (Don't create any water source in southeast)",
          "यस दिशामा कुनै पनि प्रकारको शान्ति कोठा नबनाउनुहोस् (Avoid creating any peace room in this direction)"
        ],
        color: "bg-orange-50 border-2 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700"
      },
      southwest: {
        description: "नैऋत्य कोण (Southwest direction) provides stability, strength, and relationships when balanced properly. यो दिशा पृथ्वी तत्वको प्रतिनिधित्व गर्दछ र यसको उचित प्रबन्धले जीवनमा स्थिरता र सुरक्षा ल्याउँछ।",
        dos: [
          "मास्टर बेडरूमको लागि उत्तम (Best for master bedroom)",
          "भारी फर्नीचरको लागि आदर्श (Ideal for heavy furniture)",
          "तिजोरी र मूल्यवान वस्तुहरूको लागि राम्रो (Good for safe and valuables)",
          "पृथ्वीको टोन, रातो, खैरो प्रयोग गर्नुहोस् (Use earth tones, red, brown)",
          "नैऋत्य कोणमा मुख्य बेडरूम र भारी सामान राख्नुहोस् (Place master bedroom and heavy items in southwest)",
          "यस दिशामा घरको मुख्य समर्थन संरचना बनाउनुहोस् (Create main support structure of house in this direction)"
        ],
        donts: [
          "यहाँ शौचालय नबनाउनुहोस् (Avoid toilets here)",
          "नैऋत्यमा भान्सा नबनाउनुहोस् (No kitchen in southwest)",
          "यस क्षेत्रलाई खाली नराख्नुहोस् (Don't keep this area empty)",
          "हल्का रङहरूबाट टाढा रहनुहोस् (Avoid light colors)",
          "नैऋत्य कोणमा कुनै पनि प्रकारको खाली स्थान नराख्नुहोस् (Don't leave any empty space in southwest)",
          "यस दिशामा कुनै पनि प्रकारको हल्का संरचना नबनाउनुहोस् (Avoid creating any light structure in this direction)"
        ],
        color: "bg-amber-50 border-2 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700"
      }
    };

    if (vastuDirection && recommendations[vastuDirection]) {
      setVastuRecommendation(recommendations[vastuDirection]);
      setActiveTab("direction");
    }
  };

  // Room-specific Vastu Analysis
  const analyzeRoomVastu = () => {
    const roomRecommendations: { [key: string]: { ideal: string, direction: string, tips: string[], avoid: string[] } } = {
      bedroom: {
        ideal: "मास्टर बेडरूम दक्षिण-पश्चिम (Southwest) मा, बच्चाहरूको कोठा उत्तर-पश्चिम (Northwest) वा पूर्व (East) मा राख्नुहोस्। मास्टर बेडरूम दक्षिण-पश्चिममा राख्दा घरमा स्थिरता र शान्ति कायम रहन्छ। बच्चाहरूको लागि उत्तर-पश्चिम वा पूर्व दिशा उत्तम हुन्छ।",
        direction: "सुत्दा टाउको दक्षिण (South) वा पूर्व (East) तिर राख्नुहोस्, कहिल्यै उत्तर (North) तिर नराख्नुहोस्। उत्तर दिशातिर टाउको राखेर सुत्दा स्वास्थ्य सम्बन्धी समस्या हुन सक्छ र निन्द्रा प्रभावित हुन्छ।",
        tips: [
          "हल्का निलो, हरियो जस्ता शान्त रङहरू प्रयोग गर्नुहोस् (Use calming colors like light blue, green)",
          "इलेक्ट्रोनिक्स न्यूनतम राख्नुहोस् (Keep electronics minimum)",
          "ओछ्यान ठोस भित्तामा टेकेर राख्नुहोस् (Place bed against solid wall)",
          "ओछ्यानमुखी दर्पणहरू राख्नबाट टाढा रहनुहोस् (Avoid mirrors facing bed)",
          "बेडरूममा प्राकृतिक प्रकाशको उचित व्यवस्था गर्नुहोस् (Ensure proper natural light in bedroom)",
          "ओछ्यानको तल कुनै पनि प्रकारको जल स्रोत नराख्नुहोस् (Don't keep any water source under bed)",
          "बेडरूममा ताजा हावा आउने व्यवस्था गर्नुहोस् (Ensure fresh air circulation in bedroom)"
        ],
        avoid: [
          "अतिथिहरूले उत्तरतिर टाउको राखेर नसुतुन् (Don't let guests sleep with head towards North)",
          "उत्तर-पूर्वमा संलग्न शौचालय राख्नबाट टाढा रहनुहोस् (Avoid attached toilet in Northeast)",
          "ओछ्यानमाथि कुनै बीम नराख्नुहोस् (No beams over bed)",
          "मृतकहरूको तस्बीरहरू नराख्नुहोस् (Don't keep photos of deceased)",
          "बेडरूममा काँडादार बोटबिरुवाहरू नराख्नुहोस् (Avoid thorny plants in bedroom)",
          "ओछ्यानको सिधै मुनि कुनै पनि प्रकारको स्टोरेज नबनाउनुहोस् (Don't create storage directly under bed)",
          "बेडरूममा झोल वा अनावश्यक सामान नराख्नुहोस् (Avoid clutter and unnecessary items in bedroom)"
        ]
      },
      kitchen: {
        ideal: "भान्सा दक्षिण-पूर्व (Southeast) दिशामा परिपूर्ण हुन्छ। दक्षिण-पूर्व दिशा अग्नि तत्वको दिशा हो र भान्साको लागि सबैभन्दा उपयुक्त मानिन्छ। यदि दक्षिण-पूर्व सम्भव नभएमा उत्तर-पश्चिम (Northwest) दिशा पनि उपयुक्त हुन सक्छ।",
        direction: "पकाउँदा पूर्व (East) तिर मुख गरेर पकाउनुहोस् सकारात्मक उर्जाको लागि। पूर्वतिर मुख गरेर पकाउँदा खानाको गुणस्तर राम्रो हुन्छ र परिवारका सदस्यहरूको स्वास्थ्यमा सकारात्मक प्रभाव पर्छ।",
        tips: [
          "भान्सा सफा र व्यवस्थित राख्नुहोस् (Keep kitchen clean and organized)",
          "दक्षिण-पश्चिममा अनाजहरू भण्डारण गर्नुहोस् (Store grains in Southwest)",
          "उत्तर-पूर्वमा सिंक राख्नुहोस् (Place sink in Northeast)",
          "आगोको रङहरू जस्तै रातो, सुन्तला प्रयोग गर्नुहोस् (Use fire colors like red, orange)",
          "भान्सामा प्राकृतिक प्रकाशको उचित व्यवस्था गर्नुहोस् (Ensure proper natural light in kitchen)",
          "भान्साको भुइँ सधैं सफा र सुक्खा राख्नुहोस् (Keep kitchen floor always clean and dry)",
          "भान्सामा ताजा हावा आउने व्यवस्था गर्नुहोस् (Ensure proper ventilation in kitchen)"
        ],
        avoid: [
          "कहिल्यै पनि भान्सा उत्तर-पूर्वमा नराख्नुहोस् (Never place kitchen in Northeast)",
          "भान्साको सामुन्ने शौचालय नबनाउनुहोस् (Avoid toilet opposite kitchen)",
          "चुल्हो बीममुनि नराख्नुहोस् (Don't place stove under beam)",
          "भान्सामा दर्पण नराख्नुहोस् (No mirror in kitchen)",
          "भान्सा र शौचालय बीचमा कुनै पनि प्रकारको सीधा सम्बन्ध नबनाउनुहोस् (Don't create direct connection between kitchen and toilet)",
          "भान्सामा कुनै पनि प्रकारको टुटेका भाँडाकुँडाहरू नराख्नुहोस् (Avoid keeping broken utensils in kitchen)",
          "भान्साको ढोका सिधै बेडरूममा नखुल्ने गरी बनाउनुहोस् (Avoid kitchen door opening directly to bedroom)"
        ]
      },
      livingroom: {
        ideal: "उत्तर (North), पूर्व (East) वा उत्तर-पूर्व (Northeast) दिशाहरू। बस्ने कोठा घरको अगाडि, चौडा र ठूलो हुनुपर्छ। उत्तर, पूर्व, वा उत्तर-पूर्व दिशामा बस्ने कोठा राख्दा घरमा सकारात्मक उर्जाको प्रवाह बढ्छ र परिवारका सदस्यहरूमा आपसी सम्बन्ध मधुर रहन्छ।",
        direction: "उत्तर (North) वा पूर्व (East) तिर मुख गरेर बस्नुहोस्। उत्तर वा पूर्वतिर मुख गरेर बस्दा मानिसहरूले अधिक सकारात्मक सोच र सृजनशीलता प्राप्त गर्छन्।",
        tips: [
          "उत्तर-पूर्व कुनालाई हल्का र खुला राख्नुहोस् (Keep Northeast corner light and open)",
          "उज्यालो र स्वागत योग्य रङहरू प्रयोग गर्नुहोस् (Use bright and welcoming colors)",
          "भारी फर्नीचर दक्षिण-पश्चिममा राख्नुहोस् (Place heavy furniture in Southwest)",
          "राम्रो प्राकृतिक प्रकाश सुनिश्चित गर्नुहोस् (Ensure good natural light)",
          "बस्ने कोठामा हरियो र स्वस्थ बोटबिरुवाहरू राख्नुहोस् (Keep green and healthy plants in living room)",
          "बस्ने कोठाको केन्द्र भागलाई खाली राख्नुहोस् (Keep center part of living room empty)",
          "बस्ने कोठामा सकारात्मक चित्रहरू राख्नुहोस् (Place positive pictures in living room)"
        ],
        avoid: [
          "दक्षिण-पश्चिममा बस्ने कोठा नराख्नुहोस् (Avoid living room in Southwest)",
          "बस्ने कोठा संगै शौचालय नबनाउनुहोस् (No toilets adjacent to living room)",
          "उत्तर-पूर्वमा टिभी नराख्नुहोस् (Don't place TV in Northeast)",
          "उत्तर-पूर्वमा गाढा रङहरू प्रयोग नगर्नुहोस् (Avoid dark colors in Northeast)",
          "बस्ने कोठामा कुनै पनि प्रकारको टुटेका वस्तुहरू नराख्नुहोस् (Avoid keeping broken objects in living room)",
          "बस्ने कोठाको ढोका सिधै शौचालयमा नखुल्ने गरी बनाउनुहोस् (Avoid living room door opening directly to toilet)",
          "बस्ने कोठामा धेरै झोल वा अनावश्यक सामान नराख्नुहोस् (Avoid too much clutter in living room)"
        ]
      },
      poojaroom: {
        ideal: "उत्तर-पूर्व (Northeast) कुन सबैभन्दा शुभ हुन्छ। उत्तर-पूर्व कुनालाई ईशान कोण भनिन्छ र यो सबैभन्दा पवित्र दिशा मानिन्छ। यस दिशामा पूजा कोठा बनाउँदा घरमा दिव्य आशीर्वादको प्राप्ति हुन्छ र सकारात्मक उर्जाको प्रवाह बढ्छ।",
        direction: "प्रार्थना गर्दा पूर्व (East) वा उत्तर (North) तिर मुख गरेर प्रार्थना गर्नुहोस्। पूर्व वा उत्तरतिर मुख गरेर प्रार्थना गर्दा आध्यात्मिक शक्ति र एकाग्रता बढ्छ।",
        tips: [
          "सफा र क्लटर-मुक्त राख्नुहोस् (Keep clean and clutter-free)",
          "सेतो, पहेंलो, वा हल्का रङहरू प्रयोग गर्नुहोस् (Use white, yellow, or light colors)",
          "पूर्व वा पश्चिममा मूर्तिहरू राख्नुहोस् (Place idols in East or West)",
          "शान्ति र शुद्धता कायम राख्नुहोस् (Maintain silence and purity)",
          "पूजा कोठामा तुलसी, रुद्राक्ष जस्ता पवित्र वस्तुहरू राख्नुहोस् (Keep sacred objects like Tulsi, Rudraksha in prayer room)",
          "पूजा कोठामा प्राकृतिक प्रकाशको व्यवस्था गर्नुहोस् (Ensure natural light in prayer room)",
          "पूजा कोठामा धूप, दीपक जस्ता पवित्र सुगन्धित वस्तुहरू प्रयोग गर्नुहोस् (Use sacred fragrant items like incense, lamp in prayer room)"
        ],
        avoid: [
          "कहिल्यै पनि दक्षिण-पश्चिम वा दक्षिण-पूर्वमा नराख्नुहोस् (Never place in Southwest or Southeast)",
          "माथि वा तल शौचालय नहुनुपर्छ (No toilet above or below)",
          "टुटेका मूर्तिहरू नराख्नुहोस् (Don't keep broken idols)",
          "पूजा कोठामा सुत्नबाट टाढा रहनुहोस् (Avoid sleeping in prayer room)",
          "पूजा कोठामा कुनै पनि प्रकारको गन्दगी वा फोहोर नराख्नुहोस् (Avoid keeping any dirt or waste in prayer room)",
          "पूजा कोठाको ढोका सिधै शौचालयमा नखुल्ने गरी बनाउनुहोस् (Avoid prayer room door opening directly to toilet)",
          "पूजा कोठामा कुनै पनि प्रकारको नकारात्मक चित्र वा वस्तु नराख्नुहोस् (Avoid keeping any negative pictures or objects in prayer room)"
        ]
      },
      bathroom: {
        ideal: "पश्चिम (West) वा उत्तर-पश्चिम (Northwest) दिशाहरू। पश्चिम वा उत्तर-पश्चिम दिशामा शौचालय राख्दा घरको सकारात्मक उर्जामा कुनै नकारात्मक प्रभाव पर्दैन। यी दिशाहरूमा शौचालय राख्नु सबैभन्दा सुरक्षित मानिन्छ।",
        direction: "शौचालय प्रयोग गर्दा पूर्व (East) तिर मुख गरेर बस्नुहोस्। पूर्वतिर मुख गरेर शौचालय प्रयोग गर्दा स्वास्थ्य सम्बन्धी समस्याहरूबाट बच्न सकिन्छ।",
        tips: [
          "शौचालयको ढोका बन्द राख्नुहोस् (Keep bathroom door closed)",
          "हल्का रङहरू र राम्रो भेन्टिलेशन प्रयोग गर्नुहोस् (Use light colors and good ventilation)",
          "उत्तर वा पूर्व भित्ताहरूमा दर्पणहरू राख्नुहोस् (Place mirrors on North or East walls)",
          "उचित जल निकासी सुनिश्चित गर्नुहोस् (Ensure proper drainage)",
          "शौचालयमा सफाइको उचित व्यवस्था गर्नुहोस् (Ensure proper cleaning arrangement in bathroom)",
          "शौचालयमा प्राकृतिक प्रकाशको व्यवस्था गर्नुहोस् (Ensure natural light in bathroom)",
          "शौचालयमा सुगन्धित वस्तुहरू प्रयोग गर्नुहोस् (Use fragrant items in bathroom)"
        ],
        avoid: [
          "कहिल्यै पनि उत्तर-पूर्व वा दक्षिण-पश्चिममा नराख्नुहोस् (Never in Northeast or Southwest)",
          "घरको केन्द्रमा शौचालय नबनाउनुहोस् (Avoid bathroom in center of house)",
          "शौचालय प्रयोग गर्दा पश्चिमतिर मुख नगर्नुहोस् (Don't face West while using toilet)",
          "सीढीमुनि शौचालय नबनाउनुहोस् (No bathroom under staircase)",
          "शौचालय र भान्सा बीचमा कुनै पनि प्रकारको सीधा सम्बन्ध नबनाउनुहोस् (Avoid direct connection between bathroom and kitchen)",
          "शौचालयमा कुनै पनि प्रकारको देवी-देवताको तस्बीर नराख्नुहोस् (Avoid keeping pictures of deities in bathroom)",
          "शौचालयको ढोका सिधै बस्ने कोठामा नखुल्ने गरी बनाउनुहोस् (Avoid bathroom door opening directly to living room)"
        ]
      },
      studyroom: {
        ideal: "पूर्व (East), उत्तर (North) वा उत्तर-पूर्व (Northeast) दिशाहरू। पूर्व, उत्तर, वा उत्तर-पूर्व दिशामा अध्ययन कोठा राख्दा विद्यार्थीहरूको एकाग्रता र स्मरण शक्ति बढ्छ र उनीहरूले अध्ययनमा राम्रो प्रगति गर्छन्।",
        direction: "अध्ययन गर्दा पूर्व (East) वा उत्तर (North) तिर मुख गरेर अध्ययन गर्नुहोस्। पूर्व वा उत्तरतिर मुख गरेर अध्ययन गर्दा मस्तिष्कको क्षमता बढ्छ र ज्ञानको प्राप्ति सहज हुन्छ।",
        tips: [
          "हरियो वा हल्का निलो रङहरू प्रयोग गर्नुहोस् (Use green or light blue colors)",
          "राम्रो प्राकृतिक प्रकाश सुनिश्चित गर्नुहोस् (Ensure good natural light)",
          "पुस्तकालय दक्षिण-पश्चिममा राख्नुहोस् (Place bookshelf in Southwest)",
          "उत्तर-पूर्व कुनालाई हल्का राख्नुहोस् (Keep Northeast corner light)",
          "अध्ययन कोठामा हरियो बोटबिरुवाहरू राख्नुहोस् (Keep green plants in study room)",
          "अध्ययन कोठामा शान्त वातावरण कायम राख्नुहोस् (Maintain peaceful environment in study room)",
          "अध्ययन टेबल सधैं व्यवस्थित र सफा राख्नुहोस् (Keep study table always organized and clean)"
        ],
        avoid: [
          "बीममुनि अध्ययन गर्नबाट टाढा रहनुहोस् (Avoid study under beams)",
          "अध्ययन कोठा संगै शौचालय नहुनुपर्छ (No toilet adjacent to study)",
          "अध्ययन गर्दा दक्षिणतिर मुख नगर्नुहोस् (Don't face South while studying)",
          "अध्ययन टेबलमा क्लटर नराख्नुहोस् (Avoid clutter on study table)",
          "अध्ययन कोठामा कुनै पनि प्रकारको टुटेका वस्तुहरू नराख्नुहोस् (Avoid keeping broken objects in study room)",
          "अध्ययन कोठाको ढोका सिधै शौचालयमा नखुल्ने गरी बनाउनुहोस् (Avoid study room door opening directly to toilet)",
          "अध्ययन कोठामा धेरै झोल वा अनावश्यक सामान नराख्नुहोस् (Avoid too much clutter in study room)"
        ]
      }
    };

    if (selectedRoom && roomRecommendations[selectedRoom]) {
      setRoomRecommendation(roomRecommendations[selectedRoom]);
      setActiveTab("room");
    }
  };

  const vastuData = {
    overview: {
      title: "Vastu Shastra Overview",
      icon: Compass,
      content: `Vastu Shastra is a refined combination of ancient Hindu traditions developed as an art, analyzed as a science, and interpreted astrologically for healthy living. It teaches how to design homes in harmony with natural forces: Sun, Earth, Sky, Air, and Water.

The objective is to become open to positive elemental influences while being protected from unseen malevolence. Positive vibrations bring happiness through excellence in health and business, while negative vibrations can bring grief and losses.

Vastu Shastra helps achieve the four main goals of human existence: Dharma (religion), Arth (wealth), Kama (desires), and Moksha (salvation).

वास्तु शास्त्र एक परिष्कृत संयोजन हो जुन प्राचीन हिन्दू परम्पराहरूबाट विकसित भएको हो, कला को रूपमा विश्लेषण गरिएको हो, र स्वस्थ जीवनको लागि ज्योतिषीय रूपमा व्याख्या गरिएको हो। यसले सूर्य, पृथ्वी, आकाश, हावा, र पानी जस्ता प्राकृतिक शक्तिहरूसंग सामंजस्यमा घरहरू कसरी डिजाइन गर्ने भन्ने सिकाउँछ।

उद्देश्य सकारात्मक तत्वीय प्रभावहरूको लागि खुला हुनु हो भने अदृश्य दुर्भावनाबाट सुरक्षित रहनु हो। सकारात्मक कम्पनहरूले स्वास्थ्य र व्यापारमा उत्कृष्टताको माध्यमबाट खुशी ल्याउँछन्, जबकि नकारात्मक कम्पनहरूले दुःख र घाटा ल्याउन सक्छन्।

वास्तु शास्त्रले मानव अस्तित्वको चार मुख्य लक्ष्यहरू प्राप्त गर्न मद्दत गर्दछ: धर्म (धर्म), अर्थ (धन), काम (इच्छाहरू), र मोक्ष (मुक्ति)।`
    },
    principles: {
      title: "Five Elements & Principles",
      icon: Home,
      content: `Vastu Shastra revolves around five elements from Indian Mythology:

SKY (Space): Endless vacuum holding unimaginable power
AIR: Biologically needed by all living things for subsistence  
WATER: Rainfall that filled Earth's gaps and low-lying areas
EARTH: Formed from molten rocks with great magnetic force
FIRE (Sun): Main source of life, worshipped as personification of God

DIRECTIONAL BENEFITS:
North: Happiness and Calm
East: Abundance of wealth  
South: Shortage of female members or tragedies
West: Stomach and sexual troubles among males
Northwest: Unhealthy rivalry causing trouble
Southwest: Conflict with the son
Southeast: Death will be dreaded
Center: Heavy monetary losses

वास्तु शास्त्र भारतीय पौराणिक कथाहरूबाट पाँच तत्वहरूको वरिपरि घुम्छ:

आकाश (स्पेस): अकल्पनीय शक्ति धारण गर्ने अन्तहीन शून्य
हावा: सबै जीवित वस्तुहरूको जीवनयापनको लागि जैविक रूपमा आवश्यक
पानी: वर्षाले पृथ्वीका खाली ठाउँहरू र तल्लो क्षेत्रहरू भर्यो
पृथ्वी: ठूलो चुम्बकीय शक्तिको साथ पग्लेका चट्टानहरूबाट बनेको
आगो (सूर्य): जीवनको मुख्य स्रोत, भगवानको अवतारको रूपमा पूजा गरिन्छ

दिशात्मक लाभहरू:
उत्तर: खुशी र शान्ति
पूर्व: धनको प्रचुरता
दक्षिण: महिला सदस्यहरूको कमी वा त्रासदी
पश्चिम: पुरुषहरूमा पेट र यौन समस्याहरू
उत्तर-पश्चिम: अस्वस्थ प्रतिस्पर्धाले समस्या उत्पन्न गर्दछ
दक्षिण-पश्चिम: छोरासंग संघर्ष
दक्षिण-पूर्व: मृत्यु डरलाग्दो हुनेछ
केन्द्र: भारी आर्थिक घाटा`
    },
    land: {
      title: "Land Selection & Preparation",
      icon: MapPin,
      content: `IDEAL LAND SHAPES:
Square or rectangular lands (most preferred)
Sherdah: Wider in front, narrower at rear
Gaumukhi: Narrower front, wider rear

LAND FACING DIRECTIONS:
Northeast: Best for homes, factories, offices
Northwest: Ideal for trading and business
Southeast: Good for chemical/petro-chemical industries  
Southwest: Good for night-time activities

SOIL QUALITY:
Perfect: Yellowish colored soil
Avoid: Black clay-like soil, rocky soil, soil with worms/humus

EXCAVATION FINDINGS:
Stone: Wealth abundance
Bricks: Future riches
Copper/metals: Affluence 
Coal: Illnesses and losses
Animal bones: Hindrance to development
Snake/scorpion: Construction obstacles
Anthill/termites: Wealth damage, reduced longevity

आदर्श जमिन आकारहरू:
वर्ग वा आयताकार जमिन (सबैभन्दा मनपर्ने)
शेर्दाह: अगाडि चौडा, पछाडि साँघुरो
गौमुखी: साँघुरो अगाडि, चौडा पछाडि

जमिनको दिशा मुखाबिह:
उत्तर-पूर्व: घरहरू, कारखानाहरू, कार्यालयहरूको लागि उत्तम
उत्तर-पश्चिम: व्यापार र व्यवसायको लागि आदर्श
दक्षिण-पूर्व: रासायनिक/पेट्रो-रासायनिक उद्योगहरूको लागि राम्रो
दक्षिण-पश्चिम: रातिको गतिविधिहरूको लागि राम्रो

माटोको गुणस्तर:
उत्तम: पहेंलो रंगको माटो
टाढा रहनुहोस्: कालो माटो जस्तो माटो, ढुङ्गे माटो, कीरा/ह्युमस भएको माटो

खनाई नतिजाहरू:
ढुङ्गा: धनको प्रचुरता
इँटाहरू: भविष्यको समृद्धि
तामा/धातुहरू: समृद्धि
कोइला: रोगहरू र घाटाहरू
जनावरको हड्डीहरू: विकासमा बाधा
सर्प/बिच्छी: निर्माण अवरोधहरू
बम्पर/दीमकहरू: धन क्षति, कम दीर्घायु`
    },
    doors: {
      title: "Doors & Main Entrance",
      icon: DoorOpen,
      content: `MAIN DOOR PLACEMENT:
Ideal: East, Northeast, East of Northeast, or North of Northeast
Should have two shutters and be larger than other doors
Recommended material: Teak wood

DOOR SPECIFICATIONS:
Should not face a wall
No shadow should loom on main door
Not at extreme corners or center of house
Should not face road intersections or dead-end roads
No large trees or lamp posts blocking entrance
Even number of steps for entrance stairs
Two houses should not share single main entrance

ADDITIONAL FEATURES:
Place Swastika symbol on door
Heavy decorations as adornment
South-facing doors should have balcony or verandah

मुख्य ढोका राख्ने ठाउँ:
आदर्श: पूर्व, उत्तर-पूर्व, उत्तर-पूर्वको पूर्व, वा उत्तर-पूर्वको उत्तर
दुई ढोकाका पल्टहरू हुनुपर्छ र अन्य ढोकाहरूभन्दा ठूलो हुनुपर्छ
सिफारिस गरिएको सामग्री: सागौन काठ

ढोका विशेषताहरू:
भित्तामुखी नहुनुपर्छ
मुख्य ढोकामा कुनै छाया नपर्नुपर्छ
घरको एकदमै कुनामा वा केन्द्रमा नहुनुपर्छ
सडक चौकहरू वा डेड-एन्ड सडकहरूमुखी नहुनुपर्छ
ढोकामा ठूला रूखहरू वा बत्तीका खम्बाहरूले अवरोध नगर्नुपर्छ
ढोकाका सीढीहरूको संख्या जोर हुनुपर्छ
दुई घरहरूले एउटै मुख्य ढोका साझा नगर्नुपर्छ

अतिरिक्त विशेषताहरू:
ढोकामा स्वस्तिक चिन्ह राख्नुहोस्
अलंकरणको रूपमा भारी सजावटहरू
दक्षिणमुखी ढोकाहरूमा बाल्कनी वा बरामदा हुनुपर्छ`
    },
    rooms: {
      title: "Room Placement Guide",
      icon: Bed,
      content: `LIVING ROOM:
Front of house, wide and large
Dwellers should face East or North
Avoid West or South sides
Multiple doors allowed in right locations
For negotiations: Owner faces East, guests face South/West

BEDROOMS:
Males: West or Northwest
Females: South or Southeast  
Master Bedroom: Southwest
Married children: Southwest
Children's rooms: Northwest or East
Avoid East for newly wed couples

BEDROOM NORMS:
Sleep with head facing East or South (never North for guests)
Step out with right foot first
Study on East side for best results
Wardrobes in Northwest/South
TVs/heaters in Southeast
Bathroom within room: West or North
Safes on South wall
Keep Southwest corner occupied
No photos/statues in bedrooms
Keep night bulb lighted
Colors: Light rose, dark blue, dark green (avoid white/light yellow)

बस्ने कोठा:
घरको अगाडि, चौडा र ठूलो
बस्नेहरूले पूर्व वा उत्तरतिर मुख गरेर बस्नुपर्छ
पश्चिम वा दक्षिण तिरबाट टाढा रहनुहोस्
सही ठाउँहरूमा धेरै ढोकाहरू अनुमति छ
वार्ताको लागि: मालिकले पूर्वतिर मुख गर्छन्, अतिथिहरू दक्षिण/पश्चिमतिर मुख गर्छन्

बेडरूमहरू:
पुरुषहरू: पश्चिम वा उत्तर-पश्चिम
महिलाहरू: दक्षिण वा दक्षिण-पूर्व
मास्टर बेडरूम: दक्षिण-पश्चिम
विवाहित बच्चाहरू: दक्षिण-पश्चिम
बच्चाहरूको कोठाहरू: उत्तर-पश्चिम वा पूर्व
नयाँ विवाहित जोडीहरूको लागि पूर्वबाट टाढा रहनुहोस्

बेडरूम नियमहरू:
टाउको पूर्व वा दक्षिणतिर राखेर सुत्नुहोस् (अतिथिहरूको लागि कहिल्यै पनि उत्तरतिर नराख्नुहोस्)
दायाँ खुट्टा पहिले बाहिर निकाल्नुहोस्
उत्तम नतिजाको लागि पूर्व तिर अध्ययन गर्नुहोस्
उत्तर-पश्चिम/दक्षिणमा वार्डरोबहरू
दक्षिण-पूर्वमा टिभी/हिटरहरू
कोठाभित्र शौचालय: पश्चिम वा उत्तर
दक्षिण भित्तामा तिजोरीहरू
दक्षिण-पश्चिम कुनालाई व्यस्त राख्नुहोस्
बेडरूमहरूमा तस्बीरहरू/मूर्तिहरू नराख्नुहोस्
रातको बल्ब बाली राख्नुहोस्
रङहरू: हल्का गुलाबी, गाढा निलो, गाढा हरियो (सेतो/हल्का पहेंलोबाट टाढा रहनुहोस्)`
    },
    kitchen: {
      title: "Kitchen & Dining",
      icon: Utensils,
      content: `KITCHEN PLACEMENT:
Ideal: Southeast (fire element)
Alternative: Northwest
Cook should face East
AVOID Northeast (causes family/financial problems)

KITCHEN SPECIFICS:
Sink with tap water in Northeast
Sink not near stove (disrupts peace)
Storage shelves in South and West
Heavy items in South/West

DINING ROOM:
Near kitchen in Southeast, Northwest, or Northeast
West side encourages profitability
Table at center but not towards Southwest
Head of family faces East during meals
Others face East, West, or North (never South)
Square/rectangular tables (no round/egg-shaped)
Water/wash basin in East/North (never Southeast/Southwest)
Colors: Light blue, yellow, saffron, light green

भान्सा राख्ने ठाउँ:
आदर्श: दक्षिण-पूर्व (आगो तत्व)
विकल्प: उत्तर-पश्चिम
पकाउनेले पूर्वतिर मुख गरेर पकाउनुपर्छ
उत्तर-पूर्वबाट टाढा रहनुहोस् (परिवार/आर्थिक समस्याहरू उत्पन्न गर्दछ)

भान्साको विशेषताहरू:
उत्तर-पूर्वमा नलको पानीको सिंक
सिंक चुल्होको नजिक नहुनुपर्छ (शान्तिलाई बिथोल्छ)
दक्षिण र पश्चिममा भण्डारण कोठाहरू
दक्षिण/पश्चिममा भारी वस्तुहरू

खाना कक्ष:
दक्षिण-पूर्व, उत्तर-पश्चिम, वा उत्तर-पूर्वमा भान्साको नजिक
पश्चिम तिरले लाभलाई प्रोत्साहन गर्दछ
केन्द्रमा तालिका तर दक्षिण-पश्चिमतिर नहुनुपर्छ
परिवारको मुख्यले खाना खाँदा पूर्वतिर मुख गर्छन्
अरूले पूर्व, पश्चिम, वा उत्तरतिर मुख गर्छन् (कहिल्यै पनि दक्षिणतिर नगर्नुहोस्)
वर्ग/आयताकार तालिकाहरू (गोल/अण्डाकार आकारको नहुनुपर्छ)
पूर्व/उत्तरमा पानी/धुने कुण्ड (कहिल्यै पनि दक्षिण-पूर्व/दक्षिण-पश्चिममा नहुनुपर्छ)
रङहरू: हल्का निलो, पहेंलो, केसरी, हल्का हरियो`
    }
  };

  const CurrentVastuSection = vastuData[selectedVastuSection as keyof typeof vastuData];

  // Mobile menu component
  const MobileMenu = () => (
    <div className="lg:hidden fixed inset-0 z-50 bg-background">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Vastu Sections</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-y-2">
          {Object.entries(vastuData).map(([key, data]) => {
            const IconComponent = data.icon;
            return (
              <Button
                key={key}
                variant={selectedVastuSection === key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedVastuSection(key);
                  setActiveTab("sections");
                  setMobileMenuOpen(false);
                }}
              >
                <IconComponent className="w-4 h-4 mr-3" />
                {data.title}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Vastu Shastra <span className="text-primary">Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ancient Indian architectural science for harmonious living spaces
          </p>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            Vastu Sections
          </Button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
            <Card className="p-6 sticky top-24 border-border">
              <h3 className="text-lg font-bold mb-4 text-foreground">Vastu Sections</h3>
              <div className="space-y-2">
                {Object.entries(vastuData).map(([key, data]) => {
                  const IconComponent = data.icon;
                  return (
                    <Button
                      key={key}
                      variant={selectedVastuSection === key && activeTab === "sections" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedVastuSection(key);
                        setActiveTab("sections");
                      }}
                    >
                      <IconComponent className="w-4 h-4 mr-3" />
                      {data.title}
                    </Button>
                  );
                })}
              </div>

              {/* Quick Tools */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4 text-foreground">Quick Tools</h3>
                <div className="space-y-3">
                  <Button
                    variant={activeTab === "direction" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("direction")}
                  >
                    <Compass className="w-4 h-4 mr-3" />
                    Direction Analysis
                  </Button>
                  <Button
                    variant={activeTab === "room" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("room")}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Room Specific Vastu
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6">
              <div className="flex space-x-1 rounded-lg bg-muted p-1">
                <Button
                  variant={activeTab === "sections" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveTab("sections")}
                >
                  Sections
                </Button>
                <Button
                  variant={activeTab === "direction" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveTab("direction")}
                >
                  Directions
                </Button>
                <Button
                  variant={activeTab === "room" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveTab("room")}
                >
                  Rooms
                </Button>
              </div>
            </div>

            {/* Vastu Sections Content */}
            {activeTab === "sections" && (
              <Card className="p-6 border-border mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CurrentVastuSection.icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">{CurrentVastuSection.title}</h2>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-foreground leading-relaxed text-base md:text-lg">
                    {CurrentVastuSection.content}
                  </p>
                </div>
              </Card>
            )}

            {/* Directional Analysis */}
            {activeTab === "direction" && (
              <Card className="p-6 border-border mb-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                  <Compass className="w-6 h-6 text-primary" />
                  Directional Analysis
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg mb-3 block text-foreground">Select Direction</Label>
                    <Select value={vastuDirection} onValueChange={setVastuDirection}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Choose a direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North (उत्तर) - Wealth & Career</SelectItem>
                        <SelectItem value="south">South (दक्षिण) - Stability & Protection</SelectItem>
                        <SelectItem value="east">East (पूर्व) - Health & Spirituality</SelectItem>
                        <SelectItem value="west">West (पश्चिम) - Social & Children</SelectItem>
                        <SelectItem value="northeast">Northeast (ईशान) - Divine & Prosperity</SelectItem>
                        <SelectItem value="northwest">Northwest (वायव्य) - Relationships & Travel</SelectItem>
                        <SelectItem value="southeast">Southeast (आग्नेय) - Fire & Energy</SelectItem>
                        <SelectItem value="southwest">Southwest (नैऋत्य) - Strength & Relationships</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={analyzeVastu} className="w-full" size="lg" disabled={!vastuDirection}>
                    Analyze Direction
                  </Button>

                  {vastuRecommendation && (
                    <div className={`p-6 rounded-lg border-2 ${vastuRecommendation.color} animate-fade-in`}>
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {vastuDirection.charAt(0).toUpperCase() + vastuDirection.slice(1)} Direction Analysis
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 mb-6 text-base leading-relaxed">
                        {vastuRecommendation.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Recommended (Do's)
                          </h4>
                          <ul className="space-y-2">
                            {vastuRecommendation.dos.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">✓</span>
                                <span className="text-gray-800 dark:text-gray-200 text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Avoid (Don'ts)
                          </h4>
                          <ul className="space-y-2">
                            {vastuRecommendation.donts.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">✗</span>
                                <span className="text-gray-800 dark:text-gray-200 text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Room-Specific Vastu */}
            {activeTab === "room" && (
              <Card className="p-6 border-border">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                  <Home className="w-6 h-6 text-primary" />
                  Room-Specific Vastu
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg mb-3 block text-foreground">Select Room Type</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bedroom">Bedroom (बेडरूम)</SelectItem>
                        <SelectItem value="kitchen">Kitchen (भान्सा)</SelectItem>
                        <SelectItem value="livingroom">Living Room (बस्ने कोठा)</SelectItem>
                        <SelectItem value="poojaroom">Pooja Room (पूजा कोठा)</SelectItem>
                        <SelectItem value="bathroom">Bathroom (शौचालय)</SelectItem>
                        <SelectItem value="studyroom">Study Room (अध्ययन कोठा)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={analyzeRoomVastu} className="w-full" size="lg" disabled={!selectedRoom}>
                    Analyze Room Vastu
                  </Button>

                  {roomRecommendation && (
                    <div className="bg-blue-50 border-2 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700 p-6 rounded-lg animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                            <MapPin className="w-5 h-5" />
                            Ideal Direction
                          </h3>
                          <p className="text-blue-900 dark:text-blue-300 text-base">{roomRecommendation.ideal}</p>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                            <Compass className="w-5 h-5" />
                            Facing Direction
                          </h3>
                          <p className="text-blue-900 dark:text-blue-300 text-base">{roomRecommendation.direction}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                              <CheckCircle className="w-5 h-5" />
                              Tips
                            </h3>
                            <ul className="space-y-2">
                              {roomRecommendation.tips.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1">✓</span>
                                  <span className="text-blue-900 dark:text-blue-300 text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                              <AlertCircle className="w-5 h-5" />
                              Avoid
                            </h3>
                            <ul className="space-y-2">
                              {roomRecommendation.avoid.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-red-600 mt-1">✗</span>
                                  <span className="text-blue-900 dark:text-blue-300 text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <MobileMenu />}
      </div>
    </div>
  );
};

export default VastuGuide;