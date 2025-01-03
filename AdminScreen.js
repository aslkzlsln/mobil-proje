import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  Button,
  ImageBackground,
} from "react-native";
import { Modal } from 'react-native';

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const guidelinesData = {
  guidelines: [
    {
      name: "Kılavuz 1",
      ageGroups: [
        {
          ageGroup: "0-<5 months",
          ranges: {
            IgG: { min: 1.0, max: 1.34 },
            IgA: { min: 0.07, max: 0.37 },
            IgM: { min: 0.26, max: 1.22 },
            IgG1: { min: 0.56, max: 2.15 },
            IgG2: { min: 0.0, max: 0.82 },
            IgG3: { min: 0.076, max: 8.23 },
            IgG4: { min: 0.0, max: 0.198 },
          },
        },
                {
          "ageGroup": "5-<9 months",
          "ranges": {
            "IgG": { "min": 1.64, "max": 5.88 },
            "IgA": { "min": 0.16, "max": 0.5 },
            "IgM": { "min": 0.32, "max": 1.32 },
            "IgG1": { "min": 1.02, "max": 3.69 },
            "IgG2": { "min": 0.0, "max": 0.89 },
            "IgG3": { "min": 0.119, "max": 0.740 },
            "IgG4": { "min": 0.0, "max": 0.208 }
          }
        },
        // Diğer yaş grupları buraya eklenecek...
        {
        "ageGroup": "9-<15 months",
          "ranges": {
             "IgG": { "min": 2.46, "max": 9.04 }, 
             "IgA": { "min": 0.27, "max": 0.66 }, 
             "IgM": { "min": 0.4, "max": 1.43 }, 
             "IgG1": { "min": 1.6, "max": 5.62 }, 
             "IgG2": { "min": 0.24, "max": 0.98 },
             "IgG3": { "min": 0.173, "max": 0.637 },
             "IgG4": { "min": 0.0, "max": 0.220 }
          }
        },
          { 
        "ageGroup": "15-<24 months", 
        "ranges": { 
          "IgG": { "min": 3.13, "max": 11.7 }, 
          "IgA": { "min": 0.36, "max": 0.79 }, 
          "IgM": { "min": 0.46, "max": 1.52 }, 
          "IgG1": { "min": 2.09, "max": 7.24 }, 
          "IgG2": { "min": 0.35, "max": 1.05 },
          "IgG3": { "min": 0.219, "max": 0.550 },
          "IgG4": { "min": 0.0, "max": 0.230 }
      } 
    },
          { 
      "ageGroup": "24-48 months", // 2-<4 years
      "ranges": { 
        "IgG": { "min": 2.95, "max": 11.56 }, 
        "IgA": { "min": 0.27, "max": 2.46 }, 
        "IgM": { "min": 0.37, "max": 1.84 }, 
        "IgG1": { "min": 1.58, "max": 7.21 }, 
        "IgG2": { "min": 0.39, "max": 1.76 },
        "IgG3": { "min": 0.170, "max": 0.847 },
        "IgG4": { "min": 0.004, "max": 0.491 }
      } 
    },
            { 
      "ageGroup": "4-<7 years", 
      "ranges": { 
        "IgG": { "min": 3.86, "max": 14.7 }, 
        "IgA": { "min": 0.29, "max": 2.56 }, 
        "IgM": { "min": 0.37, "max": 2.24 }, 
        "IgG1": { "min": 2.09, "max": 9.02 }, 
        "IgG2": { "min": 0.44, "max": 3.16 },
         "IgG3": { "min": 0.108, "max": 0.949 },
        "IgG4": { "min": 0.008, "max": 0.819 }
      } 
    }, 
    { 
      "ageGroup": "7-<10 years", 
      "ranges": { 
        "IgG": { "min": 4.62, "max": 16.82 }, 
        "IgA": { "min": 0.34, "max": 2.74 }, 
        "IgM": { "min": 0.38, "max": 2.51 }, 
        "IgG1": { "min": 2.53, "max": 10.19 }, 
        "IgG2": { "min": 0.54, "max": 4.35 },
         "IgG3": { "min": 0.085, "max": 10.26 },
        "IgG4": { "min": 0.010, "max": 1.087 }
      } 
    }, 
    { 
      "ageGroup": "10-<13 years", 
      "ranges": { 
        "IgG": { "min": 5.03, "max": 15.8 }, 
        "IgA": { "min": 0.42, "max": 2.95 }, 
        "IgM": { "min": 0.41, "max": 2.55 }, 
        "IgG1": { "min": 2.8, "max": 10.3 }, 
        "IgG2": { "min": 0.66, "max": 5.02 },
         "IgG3": { "min": 0.115, "max": 10.53 },
        "IgG4": { "min": 0.010, "max": 1.219 }
      } 
    }, 
    { 
      "ageGroup": "13-<16 years", 
      "ranges": { 
        "IgG": { "min": 5.09, "max": 15.8 }, 
        "IgA": { "min": 0.52, "max": 3.19 }, 
        "IgM": { "min": 0.45, "max": 2.44 }, 
        "IgG1": { "min": 2.89, "max": 9.34 }, 
        "IgG2": { "min": 0.82, "max": 5.16 },
         "IgG3": { "min": 0.200, "max": 10.32 },
        "IgG4": { "min": 0.007, "max": 1.217 }
      } 
    }, 
    { 
      "ageGroup": "16-<18 years", 
      "ranges": { 
        "IgG": { "min": 4.87, "max": 13.27 }, 
        "IgA": { "min": 0.6, "max": 3.37 }, 
        "IgM": { "min": 0.49, "max": 2.01 }, 
        "IgG1": { "min": 2.83, "max": 7.72 }, 
        "IgG2": { "min": 0.98, "max": 4.86 },
         "IgG3": { "min": 0.313, "max": 0.976 },
        "IgG4": { "min": 0.003, "max": 1.110 }
      } 
    }, 
    { 
      "ageGroup": ">18 years", 
      "ranges": { 
        "IgG": { "min": 7.67, "max": 15.9 }, 
        "IgA": { "min": 0.61, "max": 3.56 }, 
        "IgM": { "min": 0.37, "max": 2.86 }, 
        "IgG1": { "min": 3.41, "max": 8.94 }, 
        "IgG2": { "min": 1.71, "max": 6.32 },
         "IgG3": { "min": 0.184, "max": 10.60 },
        "IgG4": { "min": 0.024, "max": 1.210 }
      } 
    } 
     
      ],
    },
    {
      name: "Kılavuz 2",
      ageGroups: [
        {
          ageGroup: "0-1 months",
          ranges: {
            IgG: { min: 7.00, max: 13.00 },
            IgA: { min: 0.00, max: 0.11 },
            IgM: { min: 0.05, max: 0.30 },
            IgG1: { min: 2.18, max: 4.96 },
            IgG2: { min: 0.40, max: 1.67 },
            IgG3: { min: 0.04, max: 0.23 },
            IgG4: { min: 0.01, max: 1.20 },
          },
        },
         { 
      "ageGroup": "1-3 months", 
      "ranges": { 
        "IgG": { "min": 2.80, "max": 7.50 }, 
        "IgA": { "min": 0.06, "max": 0.50 }, 
        "IgM": { "min": 0.15, "max": 0.70 }, 
        "IgG1": { "min": 2.18, "max": 4.96 }, 
        "IgG2": { "min": 0.40, "max": 1.67 }, 
        "IgG3": { "min": 0.04, "max": 0.23 }, 
        "IgG4": { "min": 0.01, "max": 1.20 } 
      } 
    }, 
    { 
      "ageGroup": "3-4 months", 
      "ranges": { 
        "IgG": { "min": 2.80, "max": 7.50 }, 
        "IgA": { "min": 0.06, "max": 0.50 }, 
        "IgM": { "min": 0.15, "max": 0.70 }, 
        "IgG1": { "min": 1.43, "max": 3.94 }, 
        "IgG2": { "min": 0.23, "max": 1.47 }, 
        "IgG3": { "min": 0.04, "max": 1.00 }, 
        "IgG4": { "min": 0.01, "max": 1.20 } 
      } 
    }, 
    { 
      "ageGroup": "4-6 months", 
      "ranges": { 
        "IgG": { "min": 2.00, "max": 12.00 }, 
        "IgA": { "min": 0.08, "max": 0.90 }, 
        "IgM": { "min": 0.10, "max": 0.90 }, 
        "IgG1": { "min": 1.43, "max": 3.94 }, 
        "IgG2": { "min": 0.23, "max": 1.47 }, 
        "IgG3": { "min": 0.04, "max": 1.00 }, 
        "IgG4": { "min": 0.01, "max": 1.20 } 
      } 
    }, 
    { 
      "ageGroup": "6-7 months", 
      "ranges": { 
        "IgG": { "min": 2.00, "max": 12.00 }, 
        "IgA": { "min": 0.08, "max": 0.90 }, 
        "IgM": { "min": 0.10, "max": 0.90 }, 
        "IgG1": { "min": 1.9, "max": 3.88 }, 
        "IgG2": { "min": 0.37, "max": 0.6 }, 
        "IgG3": { "min": 0.12, "max": 0.62 }, 
        "IgG4": { "min": 0.01, "max": 1.20 } 
      } 
    }, 
    {
      "ageGroup": "7-9 months",
      "ranges": {
        "IgG": { "min": 3.00, "max": 15.00 },
        "IgA": { "min": 0.16, "max": 1.00 },
        "IgM": { "min": 0.25, "max": 1.15 },
        "IgG1": { "min": 1.9, "max": 3.88 }, 
        "IgG2": { "min": 0.37, "max": 0.6 }, 
        "IgG3": { "min": 0.12, "max": 0.62 }, 
        "IgG4": { "min": 0.01, "max": 1.20 } 
      }
    },
    {
      "ageGroup": "9-13 months",
      "ranges": {
        "IgG": { "min": 3.00, "max": 15.00 },
        "IgA": { "min": 0.16, "max": 1.00 },
        "IgM": { "min": 0.25, "max": 1.15 },
        "IgG1": { "min": 2.86, "max": 6.8 },
        "IgG2": { "min": 0.3, "max": 3.27 },
        "IgG3": { "min": 0.13, "max": 0.82 },
        "IgG4": { "min": 0.01, "max": 1.2 }
      }
    },
    {
      "ageGroup": "13-24 months",
      "ranges": {
        "IgG": { "min": 4.00, "max": 13.00 },
        "IgA": { "min": 0.2, "max": 2.3 },
        "IgM": { "min": 0.3, "max": 1.20 },
        "IgG1": { "min": 2.86, "max": 6.8 },
        "IgG2": { "min": 0.3, "max": 3.27 },
        "IgG3": { "min": 0.13, "max": 0.82 },
        "IgG4": { "min": 0.01, "max": 1.2 }
      }
    },
    { 
      "ageGroup": "24-36 months", 
      "ranges": { 
        "IgG": { "min": 4.00, "max": 13.00 },
        "IgA": { "min": 0.2, "max": 2.3 },
        "IgM": { "min": 0.3, "max": 1.20 }, 
        "IgG1": { "min": 3.81, "max": 8.84 }, 
        "IgG2": { "min": 0.70, "max": 4.43 }, 
        "IgG3": { "min": 0.17, "max": 0.90 }, 
        "IgG4": { "min": 0.01, "max": 1.12 } 
      } 
    }, 
    { 
      "ageGroup": "3-4 years", 
      "ranges": { 
        "IgG": { "min": 6.00, "max": 15.00 }, 
        "IgA": { "min": 0.50, "max": 1.50 }, 
        "IgM": { "min": 0.22, "max": 1.00 }, 
        "IgG1": { "min": 3.81, "max": 8.84 }, 
        "IgG2": { "min": 0.70, "max": 4.43 }, 
        "IgG3": { "min": 0.07, "max": 0.90 }, 
        "IgG4": { "min": 0.02, "max": 1.12 } 
      } 
    }, 
    { 
      "ageGroup": "4-6 years", 
      "ranges": { 
        "IgG": { "min": 6.00, "max": 15.00 }, 
        "IgA": { "min": 0.50, "max": 1.50 }, 
        "IgM": { "min": 0.22, "max": 1.00 }, 
        "IgG1": { "min": 2.92, "max": 8.16 }, 
        "IgG2": { "min": 0.83, "max": 5.13 }, 
        "IgG3": { "min": 0.08, "max": 1.11 }, 
        "IgG4": { "min": 0.02, "max": 1.12 }
      } 
    }, 
    { 
      "ageGroup": "6-8 years", 
      "ranges": { 
        "IgG": { "min": 6.39, "max": 13.44 }, 
        "IgA": { "min": 0.70, "max": 3.12 }, 
        "IgM": { "min": 0.56, "max": 3.52 }, 
        "IgG1": { "min": 4.22, "max": 8.02 }, 
        "IgG2": { "min": 1.13, "max": 4.80 }, 
        "IgG3": { "min": 0.15, "max": 1.33 }, 
        "IgG4": { "min": 0.10, "max": 1.38 } 
      } 
    }, 
    { 
      "ageGroup": "8-10 years", 
      "ranges": { 
       "IgG": { "min": 6.39, "max": 13.44 }, 
        "IgA": { "min": 0.70, "max": 3.12 }, 
        "IgM": { "min": 0.56, "max": 3.52 }, 
        "IgG1": { "min": 4.56, "max": 9.38 }, 
        "IgG2": { "min": 1.63, "max": 5.13 }, 
        "IgG3": { "min": 0.26, "max": 1.13 }, 
        "IgG4": { "min": 0.10, "max": 0.95 } 
      } 
    }, 
    { 
      "ageGroup": "10-12 years", 
      "ranges": { 
        "IgG": { "min": 6.39, "max": 13.44 }, 
        "IgA": { "min": 0.70, "max": 3.12 }, 
        "IgM": { "min": 0.56, "max": 3.52 }, 
        "IgG1": { "min": 4.56, "max": 9.52 }, 
        "IgG2": { "min": 1.47, "max": 4.93 }, 
        "IgG3": { "min": 0.12, "max": 1.79 }, 
        "IgG4": { "min": 0.10, "max": 1.53 } 
      } 
    }, 
    { 
    "ageGroup": "12-14 years", 
    "ranges": { 
      "IgG": { "min": 6.39, "max": 13.44 }, 
      "IgA": { "min": 0.70, "max": 3.12 }, 
      "IgM": { "min": 0.56, "max": 3.52 }, 
      "IgG1": { "min": 3.47, "max": 9.93 }, 
      "IgG2": { "min": 1.40, "max": 4.40 }, 
      "IgG3": { "min": 0.23, "max": 1.17 }, 
      "IgG4": { "min": 0.10, "max": 1.43 } 
    } 
    }, 
 
    { 
      "ageGroup": "Adult", 
      "ranges": { 
        "IgG": { "min": 6.39, "max": 13.44 }, 
        "IgA": { "min": 0.70, "max": 3.12 }, 
        "IgM": { "min": 0.56, "max": 3.52 },
        "IgG1": { "min": 4.22, "max": 12.92 }, 
        "IgG2": { "min": 1.17, "max": 7.47 }, 
        "IgG3": { "min": 0.41, "max": 1.29 }, 
        "IgG4": { "min": 0.10, "max": 0.67 } 
      } 
    } 
      ],
    },
    {
      name: "Kılavuz 3",
      ageGroups: [
        {
          ageGroup: "1-3 months",
          ranges: {
                IgG: { 
            min: 227, 
            max: 770, 
            meanMin: 296.44, 
            meanMax: 570.66, 
            interval: [45.72, 773.06] 
          },
          IgA: { 
            min: 6, 
            max: 47, 
            meanMin: 3.93, 
            meanMax: 27.97, 
            interval: [0, 36.36] 
          },
          IgM: { 
            min: 18, 
            max: 87, 
            meanMin: 18.22, // 34.7 - 16.48
            meanMax: 51.18, // 34.7 + 16.48
            interval: [2.78, 63.58] 
          },
        },
      },
       {  
        ageGroup: "4-6 Ay",  
         ranges: {
        IgG: { 
        min: 141, 
        max: 885, 
        meanMin: 208.97, 
        meanMax: 555.33, 
        interval: [81.17, 904.92] 
      },
      IgA: { 
        min: 7, 
        max: 63, 
        meanMin: 7.25, 
        meanMax: 32.65, 
        interval: [0, 53.39] 
      },
      IgM: { 
        min: 18, 
        max: 136, 
        meanMin: 24.44, // 50.15 - 25.71
        meanMax: 75.86, // 50.15 + 25.71
        interval: [11.56, 89.45] 
      },
    },
  },
        {  
        ageGroup: "7-12 Ay",  
         ranges: {  
          IgG: { 
        min: 350, 
        max: 1010, 
        meanMin: 417.36, 
        meanMax: 818.92, 
        interval: [189.43, 1044.81] 
      },
      IgA: { 
        min: 12, 
        max: 114, 
        meanMin: 12.46, 
        meanMax: 59.04, 
        interval: [0, 72.26] 
      },
      IgM: { 
        min: 28, 
        max: 115, 
        meanMin: 36.7, // 57.95 - 21.25
        meanMax: 79.2, // 57.95 + 21.25
        interval: [19.59, 114.57] 
      },
    },
  },
        {  
       ageGroup: "13-24 months",  
         ranges: {  
         IgG: { 
        min: 432, 
        max: 990, 
        meanMin: 493.28, 
        meanMax: 848.42, 
        interval: [284.73, 1186.48] 
      },
      IgA: { 
        min: 15, 
        max: 52, 
        meanMin: 26.4, 
        meanMax: 48.3, 
        interval: [0, 93.9] 
      },
      IgM: { 
        min: 32, 
        max: 148, 
        meanMin: 48.96, // 85.44 - 36.53
        meanMax: 121.97, // 85.44 + 36.53
        interval: [26.48, 138.56] 
      },
    },
  },
        {  
          ageGroup: "25-36 months",
          ranges: {
              IgG: { 
        min: 437, 
        max: 1320, 
        meanMin: 641.23, 
        meanMax: 1028.27, 
        interval: [369.16, 1330.59] 
      },
      IgA: { 
        min: 24, 
        max: 84, 
        meanMin: 38.2, 
        meanMax: 70.28, 
        interval: [2.29, 119.23] 
      },
      IgM: { 
        min: 47, 
        max: 144, 
        meanMin: 74.87, // 100.45 - 25.58
        meanMax: 126.03, // 100.45 + 25.58
        interval: [31.87, 161.04] 
      },
    },
  },
        {  
          ageGroup: "48-60 months", // 4-5 years = 48-60 months
          ranges: {
                IgG: { 
              min: 524, 
              max: 1400, 
              meanMin: 757.77, 
              meanMax: 1231.13, 
              interval: [449.67, 1471.82] 
            },
            IgA: { 
              min: 55, 
              max: 135, 
              meanMin: 80.85, 
              meanMax: 107.85, 
              interval: [13.24, 149.16] 
            },
            IgM: { 
              min: 65, 
              max: 205, 
              meanMin: 83.77, // 121.1 - 37.33
              meanMax: 158.43, // 121.1 + 37.33
              interval: [35.37, 181.64] 
            },
          },
        },
              {  
          ageGroup: "72-96 months", // 6-8 years = 72-96 months
          ranges: {
           IgG: { 
        min: 858, 
        max: 1600, 
        meanMin: 934.9, 
        meanMax: 1390.6, 
        interval: [523.67, 1608.34] 
      },
      IgA: { 
        min: 81, 
        max: 264, 
        meanMin: 82.84, 
        meanMax: 177.66, 
        interval: [29.73, 184.63] 
      },
      IgM: { 
        min: 47, 
        max: 198, 
        meanMin: 78.66, // 118.15 - 39.49
        meanMax: 157.64, // 118.15 + 39.49
        interval: [36.61, 199.98] 
      },
    },
  },
        {    ageGroup: "108-132 months", // 9-11 years = 108-132 months
          ranges: {
                    IgG: { 
                min: 645, 
                max: 1520, 
                meanMin: 928.88, 
                meanMax: 1425.32, 
                interval: [592.73, 1744.37] 
              },
              IgA: { 
                min: 78, 
                max: 334, 
                meanMin: 89.89, 
                meanMax: 231.01, 
                interval: [52.67, 226.55] 
              },
              IgM: { 
                min: 38, 
                max: 163, 
                meanMin: 65.66, // 102.24 - 36.58
                meanMax: 138.82, // 102.24 + 36.58
                interval: [35.21, 215.67] 
              },
            },
          },
                {  
                  ageGroup: "144-192 months", // 12-16 years = 144-192 months
                  ranges: {
                   IgG: { 
                      min: 877, 
                      max: 1620, 
                      meanMin: 984.32, 
                      meanMax: 1443.58, 
                      interval: [648.78, 1888.42] 
                    },
                    IgA: { 
                      min: 87, 
                      max: 234, 
                      meanMin: 114.06, 
                      meanMax: 213.22, 
                      interval: [82.99, 275.84] 
                    },
                    IgM: { 
                      min: 47, 
                      max: 285, 
                      meanMin: 93.92, // 143.64 - 49.71
                      meanMax: 193.35, // 143.64 + 49.71
                      interval: [30.79, 228.35] 
                    },
                  },
                },  
             
      ],
    },
    {
      name: "Kılavuz 4",
      ageGroups: [
        {
          ageGroup: "0-30 days",
          ranges: {
     IgG: {
        min: 492,
        max: 1190,
        meanMin: 653.8,
        meanMax: 1114.6,
        interval: [792.0, 1037.5],
      },
      IgA: {
        min: 5.0,
        max: 5.8,
        meanMin: 5.5,
        meanMax: 5.9,
        interval: [5.6, 5.9],
      },
      IgM: {
        min: 17.3,
        max: 29.6,
        geoMin: 15.0,
        geoMax: 22.0,
        interval: [16.7, 20.7],
      },
      IgG1: {
        min: 430,
        max: 897,
        geoMin: 523.0,
        geoMax: 827.0,
        interval: [611, 773],
      },
        IgG3: {
      min: 18,
      max: 78,
      geoMin: 20.0, // 37 - 17
      geoMax: 54.0, // 37 + 17
      interval: [31, 50],
    },
       IgG4: {
      min: 17,
      max: 81,
      geoMin: 7.0, // 24 - 17
      geoMax: 41.0, // 24 + 17
      interval: [17, 36],
    },
      IgG2: {
        min: 87,
        max: 263,
        geoMin: 106.0, // 156 - 50
        geoMax: 206.0, // 156 + 50
        interval: [135, 192],
      },
    },
  },
       {
  ageGroup: "1-5 months",
  ranges: {
 IgG: {
        min: 270,
        max: 792,
        meanMin: 280.7,
        meanMax: 666.9,
        interval: [384.2, 629.7],
      },
      IgA: {
        min: 5.8,
        max: 58.0,
        meanMin: 0.5,
        meanMax: 39.9,
        interval: [15.8, 40.9],
      },
      IgM: {
        min: 18.4,
        max: 145.0,
        geoMin: 19.9,
        geoMax: 94.7,
        interval: [41.9, 92.1],
      },
      IgG1: {
        min: 160,
        max: 574,
        geoMin: 206.0,
        geoMax: 432.0,
        interval: [261, 413],
      },
          IgG4: {
      min: 2,
      max: 48,
      geoMin: 1.0, // 15 - 14
      geoMax: 29.0, // 15 + 14
      interval: [10, 31],
    },
        IgG3: {
      min: 13,
      max: 53,
      geoMin: 12.0, // 24 - 12
      geoMax: 36.0, // 24 + 12
      interval: [17, 35],
    },
      IgG2: {
        min: 32,
        max: 108,
        geoMin: 33.0, // 59 - 26
        geoMax: 85.0, // 59 + 26
        interval: [46, 84],
      },
    },
  },  
       {
  ageGroup: "6-8 months",
  ranges: {
  IgG: {
        min: 268,
        max: 898,
        meanMin: 374.0,
        meanMax: 789.8,
        interval: [515.6, 722.4],
      },
      IgA: {
        min: 5.8,
        max: 85.8,
        meanMin: -2.0,
        meanMax: 48.4,
        interval: [20.5, 48.5],
      },
      IgM: {
        min: 26.4,
        max: 146.0,
        geoMin: 29.8,
        geoMax: 107.6,
        interval: [58.5, 98.5],
      },
         IgG3: {
      min: 14,
      max: 100,
      geoMin: 10.0, // 35 - 25
      geoMax: 60.0, // 35 + 25
      interval: [27, 56],
    },
       IgG4: {
      min: 2,
      max: 52,
      geoMin: 3.0, // 14 - 11
      geoMax: 25.0, // 14 + 11
      interval: [12, 25],
    },
      IgG1: {
        min: 279,
        max: 820,
        geoMin: 297.0,
        geoMax: 673.0,
        interval: [408, 625],
      },
      IgG2: {
        min: 36,
        max: 146,
        geoMin: 30.0, // 67 - 37
        geoMax: 104.0, // 67 + 37
        interval: [53, 97],
      },
    },
  },
        {
  ageGroup: "9-12 months",
  ranges: {
  IgG: {
        min: 421,
        max: 1100,
        meanMin: 511.6,
        meanMax: 873.8,
        interval: [641.9, 788.2],
      },
      IgA: {
        min: 18.4,
        max: 154.0,
        meanMin: 16.2,
        meanMax: 89.6,
        interval: [47.2, 76.9],
      },
          IgG3: {
      min: 18,
      max: 110,
      geoMin: 14.0, // 38 - 24
      geoMax: 62.0, // 38 + 24
      interval: [34, 53],
    },
      IgG4: {
      min: 2,
      max: 20,
      geoMin: 7.0, // 12 - 5
      geoMax: 17.0, // 12 + 5
      interval: [12, 16],
    },
      IgM: {
        min: 23.5,
        max: 180.0,
        geoMin: 45.8,
        geoMax: 126.4,
        interval: [78.9, 110.8],
      },
      IgG1: {
        min: 328,
        max: 1250,
        geoMin: 322.0,
        geoMax: 802.0,
        interval: [506, 690],
      },
      IgG2: {
        min: 25,
        max: 161,
        geoMin: 29.0, // 64 - 35
        geoMax: 99.0, // 64 + 35
        interval: [58, 85],
      },
    },
  },
       {
  ageGroup: "13-24 months",
  ranges: {
 IgG: {
        min: 365,
        max: 1200,
        meanMin: 574.7,
        meanMax: 974.1,
        interval: [748.2, 851.4],
      },
      IgA: {
        min: 11.5,
        max: 94.3,
        meanMin: 25.8,
        meanMax: 62.4,
        interval: [42.9, 52.6],
      },
         IgG3: {
      min: 16,
      max: 132,
      geoMin: 12.0, // 37 - 25
      geoMax: 62.0, // 37 + 25
      interval: [37, 49],
    },
      IgG4: {
      min: 2,
      max: 99,
      geoMin: -1.0, // 16 - 17
      geoMax: 33.0, // 16 + 17
      interval: [18, 26],
    },
      IgM: {
        min: 25.6,
        max: 201.0,
        geoMin: 58.0,
        geoMax: 138.6,
        interval: [96.3, 117.7],
      },
      IgG1: {
        min: 344,
        max: 1435,
        geoMin: 429.0,
        geoMax: 1013.0,
        interval: [702, 844],
      },
      IgG2: {
        min: 31,
        max: 264,
        geoMin: 44.0, // 93 - 49
        geoMax: 142.0, // 93 + 49
        interval: [92, 116],
      },
    },
  },
        {
  ageGroup: "25-36 months",
  ranges: {
  IgG: {
        min: 430,
        max: 1290,
        meanMin: 613.9,
        meanMax: 1030.7,
        interval: [790.4, 906.4],
      },
      IgA: {
        min: 23.0,
        max: 130.0,
        meanMin: 26.7,
        meanMax: 80.3,
        interval: [51.4, 66.3],
      },
      IgM: {
        min: 36.0,
        max: 199.0,
        geoMin: 58.6,
        geoMax: 126.4,
        interval: [89.0, 107.7],
      },
          IgG3: {
      min: 14,
      max: 125,
      geoMin: 11.0, // 32 - 21
      geoMax: 53.0, // 32 + 21
      interval: [30, 42],
    },
      IgG1: {
        min: 340,
        max: 1470,
        geoMin: 451.0,
        geoMax: 1021.0,
        interval: [712, 860],
      },
        IgG4: {
      min: 2,
      max: 171,
      geoMin: -20.0, // 20 - 40
      geoMax: 60.0, // 20 + 40
      interval: [23, 43],
    },
      IgG2: {
        min: 43,
        max: 380,
        geoMin: 30.0, // 115 - 85
        geoMax: 200.0, // 115 + 85
        interval: [112, 157],
      },
    },
  },

      {
  ageGroup: "37-48 months",
  ranges: {
    IgG: {
        min: 539,
        max: 1200,
        meanMin: 722.7,
        meanMax: 1037.1,
        interval: [844.1, 944.6],
      },
      IgA: {
        min: 40.7,
        max: 115.0,
        meanMin: 46.6,
        meanMax: 91.0,
        interval: [64.8, 79.2],
      },
          IgG3: {
      min: 15,
      max: 120,
      geoMin: 12.0, // 37 - 25
      geoMax: 62.0, // 37 + 25
      interval: [35, 50],
    },
        IgG4: {
      min: 4,
      max: 185,
      geoMin: -10.0, // 27 - 37
      geoMax: 64.0, // 27 + 37
      interval: [27, 48],
    },
      IgM: {
        min: 26.1,
        max: 188.0,
        geoMin: 50.6,
        geoMax: 121.4,
        interval: [80.9, 104.0],
      },
      IgG1: {
        min: 439,
        max: 1333,
        geoMin: 516.0,
        geoMax: 1008.0,
        interval: [726, 867],
      },
      IgG2: {
        min: 60,
        max: 410,
        geoMin: 70.0, // 161 - 92
        geoMax: 253.0, // 161 + 92
        interval: [155, 211],
      },
    },
  },
       {
  ageGroup: "49-72 months",
  ranges: {
    IgG: {
        min: 528,
        max: 1490,
        meanMin: 776.6,
        meanMax: 1195.8,
        interval: [958.5, 1058.5],
      },
      IgA: {
        min: 23.0,
        max: 205.1,
        meanMin: 54.2,
        meanMax: 129.3,
        interval: [90.2, 108.3],
      },
         IgG4: {
      min: 8,
      max: 227,
      geoMin: -11.0, // 35 - 46
      geoMax: 81.0, // 35 + 46
      interval: [37, 62],
    },
      IgM: {
        min: 33.3,
        max: 207.0,
        geoMin: 65.0,
        geoMax: 146.6,
        interval: [103.7, 123.3],
      },
      IgG1: {
        min: 468,
        max: 1333,
        geoMin: 546.0,
        geoMax: 964.0,
        interval: [726, 837],
      },
      IgG3: {
      min: 15,
      max: 107,
      geoMin: 17.0, // 37 - 20
      geoMax: 57.0, // 37 + 20
      interval: [36, 47],
    },
      IgG2: {
        min: 85,
        max: 440,
        geoMin: 89.0, // 167 - 78
        geoMax: 245.0, // 167 + 78
        interval: [160, 204],
      },
    },
  },
        {
  ageGroup: "7-8 years",
  ranges: {
  IgG: {
        min: 527,
        max: 1590,
        meanMin: 837.5,
        meanMax: 1244.0,
        interval: [1011.5, 1111.4],
      },
      IgA: {
        min: 36.1,
        max: 268.0,
        meanMin: 66.2,
        meanMax: 150.7,
        interval: [105.9, 127.0],
      },
      IgM: {
        min: 30.5,
        max: 220.0,
        geoMin: 55.3,
        geoMax: 140.5,
        interval: [95.5, 116.8],
      },
      IgG1: {
        min: 420,
        max: 1470,
        geoMin: 525.0,
        geoMax: 1087.0,
        interval: [778, 920],
      },
         IgG3: {
      min: 21,
      max: 186,
      geoMin: 8.0, // 51 - 43
      geoMax: 94.0, // 51 + 43
      interval: [51, 73],
    },
       IgG4: {
      min: 2,
      max: 198,
      geoMin: -4.0, // 42 - 46
      geoMax: 88.0, // 42 + 46
      interval: [49, 72],
    },
      IgG2: {
        min: 67,
        max: 460,
        geoMin: 96.0, // 197 - 101
        geoMax: 298.0, // 197 + 101
        interval: [193, 245],
      },
    },
  },
      {
  ageGroup: "9-10 years",
  ranges: {
 IgG: {
        min: 646,
        max: 1620,
        meanMin: 824.0,
        meanMax: 1301.6,
        interval: [1024.9, 1151.7],
      },
      IgA: {
        min: 54.0,
        max: 268.0,
        meanMin: 71.2,
        meanMax: 162.6,
        interval: [111.8, 137.0],
      },
         IgG3: {
      min: 20,
      max: 186,
      geoMin: 17.0, // 51 - 34
      geoMax: 85.0, // 51 + 34
      interval: [50, 67],
    },
        IgG4: {
      min: 5,
      max: 202,
      geoMin: -9.0, // 36 - 45
      geoMax: 81.0, // 36 + 45
      interval: [41, 63],
    },
      IgM: {
        min: 33.7,
        max: 257.0,
        geoMin: 44.4,
        geoMax: 143.2,
        interval: [90.8, 118.0],
      },
      IgG1: {
        min: 380,
        max: 1840,
        geoMin: 531.0,
        geoMax: 1189.0,
        interval: [834, 996],
      },
      IgG2: {
        min: 70,
        max: 543,
        geoMin: 93.0, // 214 - 121
        geoMax: 335.0, // 214 + 121
        interval: [211, 273],
      },
    },
  },
     {
  ageGroup: "11-12 years",
  ranges: {
 IgG: {
        min: 579,
        max: 1610,
        meanMin: 822.8,
        meanMax: 1280.6,
        interval: [995.9, 1155.6],
      },
      IgA: {
        min: 27.0,
        max: 198.0,
        meanMin: 72.8,
        meanMax: 158.8,
        interval: [109.7, 141.3],
      },
      IgM: {
        min: 30.0,
        max: 187.0,
        geoMin: 63.6,
        geoMax: 141.2,
        interval: [96.0, 124.0],
      },
        IgG3: {
      min: 29,
      max: 200,
      geoMin: 13.0, // 53 - 40
      geoMax: 93.0, // 53 + 40
      interval: [47, 75],
    },
      IgG4: {
      min: 4,
      max: 160,
      geoMin: -10.0, // 34 - 44
      geoMax: 78.0, // 34 + 44
      interval: [34, 64],
    },
      IgG1: {
        min: 599,
        max: 1560,
        geoMin: 601.0,
        geoMax: 1083.0,
        interval: [787, 953],
      },
      IgG2: {
        min: 111,
        max: 515,
        geoMin: 124.0, // 212 - 88
        geoMax: 300.0, // 212 + 88
        interval: [195, 259],
      },
    },
  },
{
  ageGroup: "13-14 years",
  ranges: {
    IgG: {
        min: 741,
        max: 1650,
        meanMin: 851.8,
        meanMax: 1323.8,
        interval: [1014.2, 1209.0],
      },
      IgA: {
        min: 52.4,
        max: 225.0,
        meanMin: 83.8,
        meanMax: 177.9,
        interval: [118.0, 159.0],
      },
      IgM: {
        min: 44.0,
        max: 206.0,
        geoMin: 77.1,
        geoMax: 164.7,
        interval: [110.3, 147.3],
      },
      IgG1: {
        min: 490,
        max: 1560,
        geoMin: 518.0,
        geoMax: 1226.0,
        interval: [805, 1061],
      },
          IgG4: {
      min: 10,
      max: 144,
      geoMin: 6.0, // 51 - 45
      geoMax: 96.0, // 51 + 45
      interval: [51, 84],
    },
          IgG3: {
      min: 28,
      max: 223,
      geoMin: 24.0, // 80 - 56
      geoMax: 136.0, // 80 + 56
      interval: [73, 117],
    },
      IgG2: {
        min: 100,
        max: 573,
        geoMin: 145.0, // 279 - 134
        geoMax: 413.0, // 279 + 134
        interval: [257, 361],
      },
    },
  }, 
       {
  ageGroup: "15-16 years",
  ranges: {
  IgA: {
      min: 48.0,
      max: 158.0,
      geoMin: 80.4, // 109.8 - 29.4
      geoMax: 139.2, // 109.8 + 29.4
      interval: [97.8, 130.3],
    },
       IgM: {
      min: 33.0,
      max: 205.0,
      geoMin: 49.7, // 99.7 - 49.7
      geoMax: 149.4, // 99.7 + 49.7
      interval: [83.7, 138.8],
    },
       IgG: {
      min: 666,
      max: 1370,
      geoMin: 773.4, // 981.1 - 207.7
      geoMax: 1188.8, // 981.1 + 207.7
      interval: [895.3, 1108.9],
    },
    IgG1: {
      min: 498,
      max: 1460,
      geoMin: 527.0, // 796 - 269
      geoMax: 1065.0, // 796 + 269
      interval: [711, 956],
    },
        IgG3: {
      min: 30,
      max: 120,
      geoMin: 37.0, // 58 - 21
      geoMax: 79.0, // 58 + 21
      interval: [51, 73],
    },
       IgG4: {
      min: 9,
      max: 187,
      geoMin: -8.0, // 36 - 44
      geoMax: 80.0, // 36 + 44
      interval: [30, 72],
    },
    IgG2: {
      min: 110,
      max: 398,
      geoMin: 155.0, // 238 - 83
      geoMax: 321.0, // 238 + 83
      interval: [214, 292],
    },
  },
},
     {
  ageGroup: "Older than 16 years",
  ranges: {
IgA: {
      min: 46.5,
      max: 221.0,
      geoMin: 65.8, // 121.3 - 55.5
      geoMax: 176.8, // 121.3 + 55.5
      interval: [102.4, 163.8],
    },
    
       IgM: {
      min: 75.0,
      max: 198.5,
      geoMin: 86.4, // 130.9 - 44.5
      geoMax: 175.4, // 130.9 + 44.5
      interval: [114.6, 161.9],
    },
       IgG: {
      min: 830,
      max: 1820,
      geoMin: 944.7, // 1224.9 - 280.2
      geoMax: 1505.1, // 1224.9 + 280.2
      interval: [1109.9, 1398.0],
    },
     IgG1: {
      min: 528,
      max: 1384,
      geoMin: 643.0, // 857 - 214
      geoMax: 1071.0, // 857 + 214
      interval: [782, 978],
    },
        IgG3: {
      min: 21,
      max: 152,
      geoMin: 17.0, // 50 - 33
      geoMax: 83.0, // 50 + 33
      interval: [43, 73],
    },
     IgG4: {
      min: 15,
      max: 202,
      geoMin: -14.0, // 33 - 47
      geoMax: 80.0, // 33 + 47
      interval: [25, 66],
    },
    IgG2: {
      min: 147,
      max: 610,
      geoMin: 179.0, // 307 - 128
      geoMax: 435.0, // 307 + 128
      interval: [271, 391],
    },
  },
},
      ],
    },
    {
      name: "Kılavuz 5",
      ageGroups: [
        {
          ageGroup: "0-1 months", // 0–30 days
          ranges: {
           IgG: {
        min: 399,
        max: 1480,
        geoMin: 651.66, // 913.85 - 262.19
        geoMax: 1176.04, // 913.85 + 262.19
        meanMin: 690.81, // 953 - 262.19
        meanMax: 1215.19, // 953 + 262.19
        interval: [855.1, 1050.9],
      },
      IgA: {
        min: 6.67,
        max: 8.75,
        geoMin: 6.32, // 6.77 - 0.45
        geoMax: 7.22, // 6.77 + 0.45
        meanMin: 6.34, // 6.79 - 0.45
        meanMax: 7.24, // 6.79 + 0.45
        interval: [6.62, 6.95],
      },

      IgM: {
        min: 5.1,
        max: 50.9,
        geoMin: 8.02, // 16.89 - 8.87
        geoMax: 25.76, // 16.89 + 8.87
        meanMin: 11.51, // 20.38 - 8.87
        meanMax: 29.25, // 20.38 + 8.87
        interval: [15.57, 5.18],
      },
    },
  },
        {
          ageGroup: "1-3 months",
          ranges: {
            IgG: {
        min: 217,
        max: 981,
        geoMin: 264.27, // 409.86 - 145.59
        geoMax: 555.45, // 409.86 + 145.59
        meanMin: 283.91, // 429.5 - 145.59
        meanMax: 575.09, // 429.5 + 145.59
        interval: [375.14, 483.86],
      },
      IgA: {
        min: 6.67,
        max: 24.6,
        geoMin: 4.42, // 9.58 - 5.16
        geoMax: 14.74, // 9.58 + 5.16
        meanMin: 5.37, // 10.53 - 5.16
        meanMax: 15.69, // 10.53 + 5.16
        interval: [8.57, 12.49],
      },
      IgM: {
        min: 15.2,
        max: 68.5,
        geoMin: 20.66, // 34.21 - 13.55
        geoMax: 47.76, // 34.21 + 13.55
        meanMin: 23.11, // 36.66 - 13.55
        meanMax: 50.21, // 36.66 + 13.55
        interval: [31.6, 41.72],
      },
    },
  },
        {
          ageGroup: "4-6 months",
          ranges: {
             IgG: {
        min: 270,
        max: 1110,
        geoMin: 203.37, // 440.17 - 236.8
        geoMax: 676.97, // 440.17 + 236.8
        meanMin: 245.63, // 482.43 - 236.8
        meanMax: 719.23, // 482.43 + 236.8
        interval: [394.01, 570.86],
      },
      IgA: {
        min: 6.67,
        max: 53,
        geoMin: 7.46, // 17.23 - 9.77
        geoMax: 27.0, // 17.23 + 9.77
        meanMin: 10.09, // 19.86 - 9.77
        meanMax: 29.63, // 19.86 + 9.77
        interval: [14.70, 25.01],
      },
      IgM: {
        min: 26.9,
        max: 130,
        geoMin: 39.32, // 69.05 - 29.73
        geoMax: 98.78, // 69.05 + 29.73
        meanMin: 45.71, // 75.44 - 29.73
        meanMax: 105.17, // 75.44 + 29.73
        interval: [64.34, 86.54],
      },
    },
  },
        {
          ageGroup: "7-12 months",
          ranges: {
         IgG: {
        min: 242,
        max: 977,
        geoMin: 350.17, // 536.79 - 186.62
        geoMax: 723.41, // 536.79 + 186.62
        meanMin: 382.35, // 568.97 - 186.62
        meanMax: 755.59, // 568.97 + 186.62
        interval: [499.28, 638.65],
      },
      IgA: {
        min: 6.68,
        max: 114,
        geoMin: 11.26, // 23.63 - 12.37
        geoMax: 36.0, // 23.63 + 12.37
        meanMin: 16.04, // 29.41 - 12.37
        meanMax: 41.78, // 29.41 + 12.37
        interval: [21.06, 37.77],
      },
      IgM: {
        min: 24.2,
        max: 162,
        geoMin: 37.66, // 73.42 - 35.76
        geoMax: 109.18, // 73.42 + 35.76
        meanMin: 45.29, // 81.05 - 35.76
        meanMax: 116.81, // 81.05 + 35.76
        interval: [67.7, 94.41],
      },
    },
  },
        {
          ageGroup: "13-24 months",
          ranges: {
            IgG: {
        min: 389,
        max: 1260,
        geoMin: 488.18, // 726.79 - 238.61
        geoMax: 965.4, // 726.79 + 238.61
        meanMin: 523.0, // 761.7 - 238.61
        meanMax: 1000.31, // 761.7 + 238.61
        interval: [672.6, 850.8],
      },
      IgA: {
        min: 13.1,
        max: 103,
        geoMin: 16.99, // 34.09 - 17.1
        geoMax: 51.19, // 34.09 + 17.1
        meanMin: 20.52, // 37.62 - 17.1
        meanMax: 54.72, // 37.62 + 17.1
        interval: [31.34, 47.85],
      },
      IgM: {
        min: 38.6,
        max: 195,
        geoMin: 73.62, // 115.25 - 41.63
        geoMax: 156.88, // 115.25 + 41.63
        meanMin: 80.94, // 122.57 - 41.63
        meanMax: 164.2, // 122.57 + 41.63
        interval: [107.03, 138.12],
      },
    },
  },
        {
          ageGroup: "25-36 months",
          ranges: {
             IgG: {
        min: 486,
        max: 1970,
        geoMin: 537.27, // 786.41 - 249.14
        geoMax: 1035.55, // 786.41 + 249.14
        meanMin: 562.36, // 811.5 - 249.14
        meanMax: 1060.64, // 811.5 + 249.14
        interval: [718.47, 904.53],
      },
      IgA: {
        min: 6.67,
        max: 135,
        geoMin: 24.35, // 48.87 - 24.52
        geoMax: 73.39, // 48.87 + 24.52
        meanMin: 35.25, // 59.77 - 24.52
        meanMax: 84.29, // 59.77 + 24.52
        interval: [46.05, 71.38],
      },
      IgG1: {
  
    min: 309,
    max: 1450,
    geoMin: 318.7, // 510.74 - 192.04
    geoMax: 702.78, // 510.74 + 192.04
    meanMin: 339.66, // 531.7 - 192.04
    meanMax: 723.74, // 531.7 + 192.04
    interval: [459.98, 603.41],
  },
    IgG2: {
      min: 87.6,
      max: 289,
      geoMin: 99.29, // 137.88 - 38.59
      geoMax: 176.47, // 137.88 + 38.59
      meanMin: 103.39, // 141.98 - 38.59
      meanMax: 180.57, // 141.98 + 38.59
      interval: [127.57, 156.39],
    },
      IgG3: {
      min: 19.8,
      max: 75,
      geoMin: 31.88, // 48.78 - 16.90
      geoMax: 65.68, // 48.78 + 16.90
      meanMin: 34.83, // 51.73 - 16.90
      meanMax: 68.63, // 51.73 + 16.90
      interval: [45.41, 58.04],
    },
        IgG4: {
      min: 7.86,
      max: 57.5,
      geoMin: 7.0, // 15.53 - 8.54
      geoMax: 24.07, // 15.53 + 8.54
      meanMin: 9.83, // 18.37 - 8.54
      meanMax: 26.91, // 18.37 + 8.54
      interval: [13.67, 23.07],
    },

      IgM: {
        min: 42.7,
        max: 236,
        geoMin: 64.11, // 104.66 - 40.55
        geoMax: 145.21, // 104.66 + 40.55
        meanMin: 70.76, // 111.31 - 40.55
        meanMax: 151.86, // 111.31 + 40.55
        interval: [96.17, 126.46],
      },
    },
  },
        {
          ageGroup: "37-60 months", // 3–5 years
          ranges: {
            IgG: {
        min: 457,
        max: 1120,
        geoMin: 659.14, // 823.19 - 164.19
        geoMax: 987.38, // 823.19 + 164.19
        meanMin: 675.68, // 839.87 - 164.19
        meanMax: 1004.06, // 839.87 + 164.19
        interval: [778.56, 901.18],
      },
      IgA: {
        min: 35.7,
        max: 192,
        geoMin: 28.7, // 62.75 - 34.05
        geoMax: 96.8, // 62.75 + 34.05
        meanMin: 34.83, // 68.98 - 34.05
        meanMax: 103.03, // 68.98 + 34.05
        interval: [56.27, 81.7],
      },
       IgG1: {
    min: 273,
    max: 679,
    geoMin: 424.45, // 506.73 - 82.28
    geoMax: 589.01, // 506.73 + 82.28
    meanMin: 431.65, // 513.93 - 82.28
    meanMax: 596.21, // 513.93 + 82.28
    interval: [483.2, 544.65],
  },
      IgG2: {
      min: 73.3,
      max: 271,
      geoMin: 93.12, // 143.92 - 50.80
      geoMax: 194.72, // 143.92 + 50.80
      meanMin: 101.15, // 151.95 - 50.80
      meanMax: 202.75, // 151.95 + 50.80
      interval: [132.98, 170.92],
    },
      IgG3: {
      min: 20.8,
      max: 93.2,
      geoMin: 22.5, // 44.05 - 21.55
      geoMax: 65.6, // 44.05 + 21.55
      meanMin: 23.71, // 45.26 - 21.55
      meanMax: 66.81, // 45.26 + 21.55
      interval: [37.21, 53.30],
    },
      IgG4: {
      min: 7.86,
      max: 122,
      geoMin: 15.39, // 30.81 - 15.42
      geoMax: 46.23, // 30.81 + 15.42
      meanMin: 25.33, // 40.75 - 15.42
      meanMax: 56.17, // 40.75 + 15.42
      interval: [28.84, 52.65],
    },
      IgM: {
        min: 58.7,
        max: 198,
        geoMin: 76.36, // 115.6 - 39.24
        geoMax: 154.84, // 115.6 + 39.24
        meanMin: 82.55, // 121.79 - 39.24
        meanMax: 161.03, // 121.79 + 39.24
        interval: [107.13, 136.44],
      },
    },
  },
        {
          ageGroup: "61-96 months", // 6–8 years
          ranges: {
           IgG: {
        min: 483,
        max: 1580,
        geoMin: 727.2, // 982.86 - 255.53
        geoMax: 1238.39, // 982.86 + 255.53
        meanMin: 759.4, // 1014.93 - 255.53
        meanMax: 1270.46, // 1014.93 + 255.53
        interval: [919.52, 1110.35],
      },
      IgA: {
        min: 44.8,
        max: 276,
        geoMin: 47.72, // 97.38 - 49.66
        geoMax: 147.04, // 97.38 + 49.66
        meanMin: 57.24, // 106.9 - 49.66
        meanMax: 156.56, // 106.9 + 49.66
        interval: [88.36, 125.45],
      },
        IgG1: {
    min: 292,
    max: 781,
    geoMin: 446.3, // 567.94 - 121.64
    geoMax: 689.58, // 567.94 + 121.64
    meanMin: 459.36, // 581 - 121.64
    meanMax: 702.64, // 581 + 121.64
    interval: [535.87, 626.72],
  },
      IgG2: {
      min: 88.1,
      max: 408,
      geoMin: 110.16, // 196.57 - 86.41
      geoMax: 282.98, // 196.57 + 86.41
      meanMin: 127.26, // 213.67 - 86.41
      meanMax: 300.08, // 213.67 + 86.41
      interval: [181.4, 245.93],
    },
       IgG3: {
      min: 18.9,
      max: 135,
      geoMin: 26.27, // 56.82 - 30.55
      geoMax: 87.37, // 56.82 + 30.55
      meanMin: 35.02, // 65.53 - 30.55
      meanMax: 96.08, // 65.53 + 30.55
      interval: [53.01, 78.06],
    },
        IgG4: {
      min: 7.86,
      max: 157,
      geoMin: 16.28, // 39.33 - 23.05
      geoMax: 62.38, // 39.33 + 23.05
      meanMin: 27.69, // 50.94 - 23.05
      meanMax: 74.99, // 50.94 + 23.05
      interval: [37.11, 64.77],
    },
      IgM: {
        min: 50.3,
        max: 242,
        geoMin: 66.78, // 108.05 - 41.27
        geoMax: 149.32, // 108.05 + 41.27
        meanMin: 73.46, // 114.73 - 41.27
        meanMax: 156.0, // 114.73 + 41.27
        interval: [99.32, 130.14],
      },
    },
  },
        {
          ageGroup: "97-132 months", // 9–11 years
          ranges: {
            IgG: { min: 6.42, max: 22.9 },
            IgA: { min: 0.326, max: 2.62 },
            IgM: { min: 0.374, max: 2.13 },
            IgG1: { min: 1.53, max: 4.10 },
            IgG2: { min: 0.81, max: 4.42 },
            IgG3: { min: 0.341, max: 2.0 },
            IgG4: { min: 0.0786, max: 0.938 },
          },
        },
        {
          ageGroup: "133-192 months", // 12–16 years
          ranges: {
            IgG: {
        min: 636,
        max: 1610,
        geoMin: 919.73, // 1123.56 - 203.83
        geoMax: 1327.39, // 1123.56 + 203.83
        meanMin: 938.24, // 1142.07 - 203.83
        meanMax: 1345.9, // 1142.07 + 203.83
        interval: [1065.96, 1218.18],
      },
      IgA: {
        min: 36.4,
        max: 305,
        geoMin: 65.66, // 112.16 - 47.51
        geoMax: 159.67, // 112.16 + 47.51
        meanMin: 73.49, // 120.9 - 47.51
        meanMax: 168.41, // 120.9 + 47.51
        interval: [99.29, 172.11],
      },
        IgG1: {
    min: 344,
    max: 958,
    geoMin: 504.51, // 635.52 - 131.01
    geoMax: 766.53, // 635.52 + 131.01
    meanMin: 517.92, // 648.53 - 131.01
    meanMax: 779.54, // 648.53 + 131.01
    interval: [599.61, 697.45],
  },
      IgG2: {
      min: 159,
      max: 406,
      geoMin: 192.47, // 261.62 - 69.14
      geoMax: 330.76, // 261.62 + 69.14
      meanMin: 201.09, // 270.23 - 69.14
      meanMax: 339.37, // 270.23 + 69.14
      interval: [244.41, 296.05],
    },
        IgG3: {
      min: 35.2,
      max: 150,
      geoMin: 43.44, // 75.30 - 31.86
      geoMax: 107.16, // 75.30 + 31.86
      meanMin: 49.53, // 81.39 - 31.86
      meanMax: 113.25, // 81.39 + 31.86
      interval: [69.49, 93.28],
    },
        IgG4: {
      min: 7.86,
      max: 119,
      geoMin: 14.3, // 31.03 - 16.73
      geoMax: 47.76, // 31.03 + 16.73
      meanMin: 22.36, // 39.51 - 16.73
      meanMax: 56.24, // 39.51 + 16.73
      interval: [29.53, 49.49],
    },
      IgM: {
        min: 42.4,
        max: 197,
        geoMin: 79.77, // 119.16 - 39.31
        geoMax: 158.47, // 119.16 + 39.31
        meanMin: 86.47, // 125.78 - 39.31
        meanMax: 165.09, // 125.78 + 39.31
        interval: [111.1, 140.46],
      },
    },
  },
        {
          ageGroup: "193-216 months", // 16–18 years
          ranges: {
                 IgG: {
        min: 688,
        max: 2430,
        geoMin: 915.8, // 1277.20 - 361.89
        geoMax: 1639.09, // 1277.20 + 361.89
        meanMin: 960.88, // 1322.77 - 361.89
        meanMax: 1684.66, // 1322.77 + 361.89
        interval: [1187.63, 1457.9],
      },
          IgA: {
      min: 46.3,
      max: 385,
      geoMin: 89.29, // 179.21 - 89.92
      geoMax: 269.13, // 179.21 + 89.92
      meanMin: 111.92, // 201.84 - 89.92
      meanMax: 291.76, // 201.84 + 89.92
      interval: [168.26, 235.41],
    },
      IgG1: {
    min: 403,
    max: 1520,
    geoMin: 415.73, // 645.35 - 229.62
    geoMax: 874.97, // 645.35 + 229.62
    meanMin: 444.93, // 674.5 - 229.62
    meanMax: 904.12, // 674.5 + 229.62
    interval: [588.75, 760.24],
  },
      IgG2: {
      min: 184,
      max: 696,
      geoMin: 243.92, // 359.76 - 115.83
      geoMax: 475.59, // 359.76 + 115.83
      meanMin: 259.93, // 375.9 - 115.83
      meanMax: 491.73, // 375.9 + 115.83
      interval: [332.6, 419.15],
    },
        IgG3: {
      min: 29.3,
      max: 200,
      geoMin: 43.9, // 86.33 - 43.29
      geoMax: 129.62, // 86.33 + 43.29
      meanMin: 51.91, // 95.12 - 43.29
      meanMax: 138.41, // 95.12 + 43.29
      interval: [78.95, 111.28],
    },
        IgG4: {
      min: 7.86,
      max: 157,
      geoMin: 15.81, // 38.89 - 23.08
      geoMax: 61.97, // 38.89 + 23.08
      meanMin: 27.42, // 50.16 - 23.08
      meanMax: 73.24, // 50.16 + 23.08
      interval: [36.32, 64.01],
    },
          IgM: {
        min: 60.7,
        max: 323,
        geoMin: 66.28, // 130.60 - 64.32
        geoMax: 194.92, // 130.60 + 64.32
        meanMin: 78.22, // 142.54 - 64.32
        meanMax: 206.86, // 142.54 + 64.32
        interval: [118.53, 166.55],
      },
    },
  },
      ],
    },
  ],
};


const AdminScreen = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newTestName, setNewTestName] = useState("");
  const [newTestValue, setNewTestValue] = useState("");
  const [newTestDate, setNewTestDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchPatientName, setSearchPatientName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPatientDoc, setCurrentPatientDoc] = useState(null);
  const [age, setAge] = useState("");
  const [testValues, setTestValues] = useState({ IgA: "", IgM: "", IgG: "" });
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentPatientBirthDate, setCurrentPatientBirthDate] = useState("");

  // Utility: Calculate Age in Months
  const calculateAgeInMonths = (birthDate, testDate) => {
    const birth = new Date(birthDate);
    const test = new Date(testDate);
    if (isNaN(birth.getTime()) || isNaN(test.getTime())) return null;

    const yearsInMonths = (test.getFullYear() - birth.getFullYear()) * 12;
    const monthsDifference = test.getMonth() - birth.getMonth();
    const daysDifference = test.getDate() - birth.getDate();

    let totalMonths = yearsInMonths + monthsDifference;
    if (daysDifference < 0) {
      totalMonths--;
    }
    return totalMonths;
  };

  // Utility: Classify Test Results
  const classifyTestResult = (testName, value, ageInMonths, guide) => {
    const ageGroup = guide.ageGroups.find((group) => {
      const match = group.ageGroup.match(/^(\d+)\s*(?:-<|<|–|>|-)?\s*(\d+)?\s*(months)?$/);
      if (!match) return false;

      const [_, minAge, maxAge] = match.map((age) => parseInt(age, 10));
      return ageInMonths >= minAge && ageInMonths <= maxAge;
    });

    if (!ageGroup) return { status: "Yaş grubu bulunamadı", range: null };

    const range = ageGroup.ranges[testName];
    if (!range) return { status: "Referans aralığı yok", range: null };

    if (value < range.min) return { status: "Düşük", range };
    if (value > range.max) return { status: "Yüksek", range };
    return { status: "Normal", range };
  };

  // Handle Test Click to Show Modal
  const handleTestClick = (test) => {
    setSelectedTest(test);
    setModalVisible(true);
  };

   const addPatientTest = async () => {
    if (!newPatientName.trim() || !newTestName || !newTestValue.trim() || !newTestDate) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
  
    const parsedValue = parseFloat(newTestValue.replace(",", "."));
    if (isNaN(parsedValue)) {
      alert("Geçerli bir değer girin!");
      return;
    }
  
    const newTest = {
      testName: newTestName,
      value: parsedValue,
      date: newTestDate.toISOString().split("T")[0],
    };
  
    try {
      const patientCollection = collection(db, "patients");
      const q = query(patientCollection, where("patientName", "==", newPatientName.trim()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Eğer hasta bulunmazsa yeni bir hasta ekleniyor
        await addDoc(patientCollection, { 
          patientName: newPatientName.trim(), 
          tests: [newTest]
        });
        alert("Hasta ve tahlil başarıyla eklendi!");
      } else {
        // Hasta zaten varsa, mevcut testler alınır
        const patientDoc = snapshot.docs[0];
        const patientRef = patientDoc.ref;
  
        const currentTests = patientDoc.data().tests || [];
        
        let comparison;
        if (currentTests.length === 0) {
          // İlk test ekleniyorsa başlangıç olarak kabul edilir
          comparison = { icon: "Başlangıç", color: "gray" };
        } else {
          const lastTest = currentTests[currentTests.length - 1]; // Son test alınır
          comparison = compareValues(parsedValue, lastTest.value); // Sonraki test ile karşılaştırılır
        }
  
        // Eklenen testin karşılaştırma bilgilerini ekle
        newTest.comparison = comparison;
  
        // Testi Firestore'a ekleyin
        await updateDoc(patientRef, { tests: arrayUnion(newTest) });
        alert("Tahlil başarıyla eklendi!");
      }
  
      // Test sonrası input alanlarını sıfırlayın
      setNewPatientName("");
      setNewTestName("");
      setNewTestValue("");
      setNewTestDate(new Date());
    } catch (error) {
      console.error("Hata: ", error);
      alert("Tahlil eklenirken bir hata oluştu.");
    }
  };

    const deleteTest = async (testToDelete) => {
    if (!currentPatientDoc) {
      alert("Hasta seçilmedi!");
      return;
    }
  
    try {
      const patientRef = currentPatientDoc.ref;
      const patientData = currentPatientDoc.data();
      const updatedTests = (patientData.tests || []).filter(
        (test) =>
          test.testName !== testToDelete.testName ||
          test.value !== testToDelete.value ||
          test.date !== testToDelete.date
      );
  
      await updateDoc(patientRef, { tests: updatedTests });
      alert("Tahlil başarıyla silindi!");
  
      // Arama sonuçlarını güncelle
      setSearchResults(updatedTests);
    } catch (error) {
      console.error("Tahlil silinirken bir hata oluştu: ", error);
      alert("Tahlil silinirken bir hata oluştu.");
    }
  };

 const searchPatientTests = async () => {
    if (!searchPatientName.trim()) {
      alert("Lütfen bir hasta adı girin!");
      return;
    }
    try {
      const patientCollection = collection(db, "patients");
      const q = query(patientCollection, where("patientName", "==", searchPatientName.trim()));
  
      const snapshot = await getDocs(q);
  
      if (snapshot.empty) {
        alert("Hasta bulunamadı!");
        setSearchResults([]);
      } else {
        const patientDoc = snapshot.docs[0];
        setCurrentPatientDoc(patientDoc);
        const patientData = patientDoc.data();
        const tests = patientData.tests || [];
  
        if (tests.length > 0) {
          let previousValue = null;
  
          const updatedResults = tests.map((test) => {
            let comparison = { icon: "Başlangıç", color: "gray" };
  
            if (previousValue !== null) {
              if (test.value > previousValue) {
                comparison = { icon: "⬆", color: "red" };
              } else if (test.value < previousValue) {
                comparison = { icon: "⬇", color: "green" };
              } else {
                comparison = { icon: "↔️", color: "blue" };
              }
            }
  
            previousValue = test.value;
  
            return {
              ...test,
              comparison,
            };
          });
  
          setSearchResults(updatedResults);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error("Arama sırasında hata oluştu: ", error);
      alert("Hasta arama sırasında bir hata oluştu.");
    }
  };

    const calculateReferences = () => {
    const ageNum = parseInt(age, 10);
  
    if (isNaN(ageNum)) {
      alert("Lütfen geçerli bir yaş girin.");
      return;
    }
  
    const calculatedResults = guidelinesData.guidelines.map((guide) => {
      const result = {
        name: guide.name,
        ageGroups: [],
      };
  
      guide.ageGroups.forEach((ageGroup) => {
        const [minAge, maxAge] = ageGroup.ageGroup
          .replace("months", "")
          .replace("years", "")
          .split("-<")
          .map((val) => parseInt(val.trim(), 10));
  
        if (ageNum >= minAge && (!maxAge || ageNum < maxAge)) {
          const tests = Object.keys(testValues).map((test) => {
            const value = parseFloat(testValues[test]);
            const ranges = ageGroup.ranges[test] || {};
  
            const minMaxStatus =
              ranges.min && ranges.max
                ? value < ranges.min
                  ? "⬇"
                  : value > ranges.max
                  ? "⬆"
                  : "↔"
                : "-";
  
            const geoMinMaxStatus =
              ranges.geoMin && ranges.geoMax
                ? value < ranges.geoMin
                  ? "⬇"
                  : value > ranges.geoMax
                  ? "⬆"
                  : "↔"
                : "-";
  
            const meanMinMaxStatus =
              ranges.meanMin && ranges.meanMax
                ? value < ranges.meanMin
                  ? "⬇"
                  : value > ranges.meanMax
                  ? "⬆"
                  : "↔"
                : "-";
  
            const intervalStatus =
              ranges.interval
                ? value < ranges.interval[0]
                  ? "⬇"
                  : value > ranges.interval[1]
                  ? "⬆"
                  : "↔"
                : "-";
  
            return {
              test,
              value,
              statuses: {
                minMax: minMaxStatus,
                geoMinMax: geoMinMaxStatus,
                meanMinMax: meanMinMaxStatus,
                interval: intervalStatus,
              },
            };
          });
  
          result.ageGroups.push({
            ageGroup: ageGroup.ageGroup,
            tests,
          });
        }
      });
  
      return result;
    });
  
    setResults(calculatedResults);
  };
  const renderDashboard = () => (
   // <ImageBackground source={require("../assets/adminarka.png")} style={styles.background}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <Text style={styles.header}>ADMİN DASHBOARD</Text>
        <TouchableOpacity style={styles.card} onPress={() => setActiveSection("createGuide")}>
          <Text style={styles.cardText}>Hasta Ekle/Arama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setActiveSection("searchPatients")}>
          <Text style={styles.cardText}>Kılavuz Görüntüle</Text>
        </TouchableOpacity>
      </ScrollView>
    
  );
  const renderCreateGuide = () => (
   // <ImageBackground source={require("../assets/heklearka.png")} style={styles.background}>
      <View style={styles.pinkContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setActiveSection("dashboard")}>
          <Text style={styles.backButtonText}>GERİ</Text>
        </TouchableOpacity>
        
        <Text style={styles.header}>Hasta Arama</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsAddingPatient(!isAddingPatient)}
        >
          <Text style={styles.toggleButtonText}>
            {isAddingPatient ? "Hasta Arama Modu" : "Hasta Ekle Modu"}
          </Text>
        </TouchableOpacity>
  
        {isAddingPatient ? (
          // Patient Add Form
          <View>
            <TextInput
              style={styles.input}
              placeholder="Hasta Adı Soyadı"
              value={newPatientName}
              onChangeText={setNewPatientName}
            />
            <Picker
              selectedValue={newTestName}
              style={styles.picker}
              onValueChange={(itemValue) => setNewTestName(itemValue)}
            >
              <Picker.Item label="Tahlil Türü Seçin" value="" />
              <Picker.Item label="IgA" value="IgA" />
              <Picker.Item label="IgM" value="IgM" />
              <Picker.Item label="IgG" value="IgG" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Değer"
              value={newTestValue}
              onChangeText={setNewTestValue}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {newTestDate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newTestDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setNewTestDate(selectedDate);
                }}
              />
            )}
            <Button title="Ekle" onPress={addPatientTest} />
          </View>
        ) : (
          // Patient Search Form
          <View>
            <TextInput
              style={styles.input}
              placeholder="Hasta Adı Giriniz"
              value={searchPatientName}
              onChangeText={setSearchPatientName}
            />
            <Button title="Ara" onPress={searchPatientTests} />
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `${item.testName}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleTestClick(item)}>
                    <View style={styles.listItem}>
                      <Text style={styles.testName}>{item.testName}</Text>
                      <Text style={styles.result}>
                        Tarih: {item.date}, Değer: {item.value.toFixed(2)}{" "}
                        <Text style={{ color: item.comparison?.color || "gray" }}>
                          {item.comparison?.icon || "Başlangıç"}
                        </Text>
                      </Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteTest(item)}
                      >
                        <Text style={styles.deleteButtonText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noResult}>Sonuç Bulunamadı</Text>
            )}
          </View>
        )}
      </View>
    
  );
  

const renderSearchPatients = () => (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Yaş ve Test Rehberi</Text>
      <TextInput
        style={styles.input}
        placeholder="Yaşınızı Girin"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <View style={styles.testContainer}>
        {Object.keys(testValues).map((key) => (
          <View key={key} style={styles.testBox}>
            <Text style={styles.testLabel}>{key}</Text>
            <TextInput
              style={styles.testInput}
              placeholder={`Değer girin (${key})`}
              value={testValues[key]}
              onChangeText={(value) =>
                setTestValues((prev) => ({ ...prev, [key]: value }))
              }
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
      <Button title="Hesapla" onPress={calculateReferences} />
      <ScrollView style={{ flex: 1 }}>
  {results.length > 0 ? (
    results.map((guide) => (
      <View key={guide.name} style={styles.guideContainer}>
        <Text style={styles.guideHeader}>{guide.name}</Text>
        {guide.ageGroups.map((ageGroup) => (
          <View key={ageGroup.ageGroup} style={styles.ageGroupContainer}>
            <Text style={styles.ageGroupHeader}>
              Yaş Grubu: {ageGroup.ageGroup}
            </Text>
            {ageGroup.tests.map((test) => (
              <View key={test.test} style={styles.testDetails}>
                <Text style={styles.testHeader}>{test.test}</Text>
                <Text>Değer: {test.value.toFixed(2)}</Text>
                <Text>Min - Max: {test.statuses.minMax}</Text>
                <Text>Geo Min - Max: {test.statuses.geoMinMax}</Text>
                <Text>Mean Min - Max: {test.statuses.meanMinMax}</Text>
                <Text>Interval Min - Max: {test.statuses.interval}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    ))
  ) : (
    <Text>Sonuç bulunamadı.</Text>
  )}
</ScrollView>




      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setActiveSection("dashboard")}
      >
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeSection === "dashboard" && renderDashboard()}
      {activeSection === "createGuide" && renderCreateGuide()}
      {activeSection === "searchPatients" && renderSearchPatients()}
      {modalVisible && selectedTest && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalHeader}>{`Test: ${selectedTest.testName}`}</Text>
              {guidelinesData.guidelines.map((guide, index) => {
                const ageInMonths = calculateAgeInMonths(
                  currentPatientBirthDate,
                  selectedTest.date
                );
                const evaluation = classifyTestResult(
                  selectedTest.testName,
                  selectedTest.value,
                  ageInMonths,
                  guide
                );
                return (
                  <View key={index}>
                    <Text style={styles.guideHeader}>{guide.name}</Text>
                    <Text>
                      {`Durum: ${evaluation.status} (Min: ${
                        evaluation.range?.min || "N/A"
                      }, Max: ${evaluation.range?.max || "N/A"})`}
                    </Text>
                  </View>
                );
              })}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 75,
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginVertical: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
  },
  datePickerButton: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#007BFF",
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginVertical: 15,
    width: "80%",
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  testContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  testBox: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  testLabel: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginBottom: 8,
  },
  testInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
    width: "100%",
    fontSize: 14,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 5,
  },
  testName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  result: {
    fontSize: 14,
    color: "#555",
  },
  noResult: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginVertical: 16,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  deleteButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },


  guideContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  guideHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ageGroupContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  ageGroupHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  testDetails: {
    marginVertical: 5,
    padding: 5,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  
});

export default AdminScreen;
