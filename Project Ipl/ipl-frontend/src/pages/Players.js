import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// A map of player names to their image URLs
const playerImages = {
  'V Kohli': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2.png',
  'RG Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/6.png',
  'MS Dhoni': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1.png',
  'RA Jadeja': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/46.png',
  'JJ Bumrah': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/153.png',
  'SV Samson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/190.png',
  'KL Rahul': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/19.png',
  'HH Pandya': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/212.png',
  'Shubman Gill': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/214.png',
  'RD Gaikwad': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/103.png',
  'F du Plessis': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/24.png',
  'GJ Maxwell': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/28.png',
  'Mohammed Siraj': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/62.png',
  'R Ashwin': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/8.png',
  'YS Chahal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/10.png',
  'JC Buttler': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/182.png',
  'S Dhawan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/11.png',
  'AR Patel': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/110.png',
  'Kuldeep Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/140.png',
  'AD Russell': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/141.png',
  'SP Narine': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/146.png',
  'SA Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/174.png',
  'Ishan Kishan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/164.png',
  'Rashid Khan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/213.png',
  'DA Warner': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/211.png',
  'R Pant': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/216.png',
  'SS Iyer': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/201.png',
  'MP Stoinis': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/23.png',
  'Q de Kock': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/170.png',
  'K Rabada': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/148.png',
  'TA Boult': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/185.png',
  'MA Starc': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/488.png',
  'PJ Cummins': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/489.png',
  'Abhishek Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/237.png',
  'Rinku Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/240.png',
  'Tilak Varma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/982.png',
  'N Pooran': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/172.png',
  'SO Hetmyer': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/197.png',
  'DP Conway': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/556.png',
  'D Padikkal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/440.png',
  'PP Shaw': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/215.png',
  'Harpreet Brar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws..com/ipl/IPLHeadshot2023/309.png',
  'Arshdeep Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/243.png',
  'JM Bairstow': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/188.png',
  'LS Livingstone': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/189.png',
  'R Powell': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/198.png',
  'A Nortje': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/503.png',
  'VR Iyer': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/586.png',
  'RA Tripathi': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/136.png',
  'AK Markram': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/559.png',
  'H Klaasen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/560.png',
  'B Kumar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/15.png',
  'T Natarajan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/138.png',
  'Washington Sundar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20.png',
  'Mohammed Shami': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/44.png',
  'WP Saha': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/45.png',
  'R Tewatia': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/131.png',
  'M Pathirana': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/984.png',
  'M Theekshana': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/629.png',
  'MJ Santner': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/77.png',
  'MM Ali': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/206.png',
  'S Dube': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/210.png',
  'AM Rahane': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/4.png',
  'DL Chahar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/91.png',
  'KH Pandya': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/218.png',
  'A Badoni': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/976.png',
  'M Wood': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/506.png',
  'Ravi Bishnoi': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/446.png',
  'A Mishra': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/30.png',
  'JDS Neesham': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/186.png',
  'D Brevis': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/967.png',
  'TH David': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/636.png',
  'JP Behrendorff': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/511.png',
  'PP Chawla': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/7.png',
  'SM Curran': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/204.png',
  'PN Mankad': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/130.png',
  'MR Marsh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/207.png',
  'L Ngidi': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/504.png',
  'M Jansen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot20A23/634.png',
  'Fazalhaq Farooqi': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/997.png',
  'Umran Malik': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/616.png',
  'Mayank Agarwal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/14.png',
  'HC Brook': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1006.png',
  'GD Phillips': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/631.png',
  'LH Ferguson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/163.png',
  'TG Southee': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/184.png',
  'UT Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/43.png',
  'CV Varun': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/308.png',
  'SN Thakur': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/105.png',
  'Mandeep Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/13.png',
  'AS Roy': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1014.png',
  'KS Williamson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/47.png',
  'DA Miller': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/128.png',
  'V Shankar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/99.png',
  'MS Wade': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/169.png',
  'J Little': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1011.png',
  'AS Joseph': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/508.png',
  'OC McCoy': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/970.png',
  'JO Holder': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/194.png',
  'R Parag': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/299.png',
  'KR Sen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/971.png',
  'P Krishna': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/150.png',
  'YBK Jaiswal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/441.png',
  'DC Jurel': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/972.png',
  'A Zampa': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/149.png',
  'KM Asif': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/234.png',
  'M Ashwin': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/31.png',
  'Akash Deep': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/974.png',
  'Finn Allen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/558.png',
  'Shahbaz Ahmed': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/445.png',
  'HV Patel': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/102.png',
  'JR Hazlewood': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/505.png',
  'DJ Willey': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/208.png',
  'KV Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/9.png',
  'RM Patidar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/588.png',
  'Mahipal Lomror': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/134.png',
  'SS Prabhudessai': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/300.png',
  'Anuj Rawat': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/444.png',
  'KD Karthik': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/12.png',
  'C Green': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1007.png',
  'PBB Rajapaksa': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/561.png',
  'JM Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/977.png',
  'RD Chahar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/306.png',
  'NT Ellis': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/637.png',
  'K Gowtham': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/143.png',
  'P Simran Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/301.png',
  'Shahrukh Khan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/589.png',
  'Harpreet Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/33.png',
  'Atharva Taide': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/978.png',
  'MW Short': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1010.png',
  'RP Meredith': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/638.png',
  'Aman Khan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/980.png',
  'Lalit Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/450.png',
  'C Sakariya': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/591.png',
  'Mustafizur Rahman': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/157.png',
  'KK Ahmed': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/104.png',
  'SNJ Rinku Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/240.png',
  'N Rana': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/142.png',
  'Rahmanullah Gurbaz': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/981.png',
  'D Wiese': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/195.png',
  'Mandeep Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/13.png',
  'Kulwant Khejroliya': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/108.png',
  'KS Bharat': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/443.png',
  'B Sai Sudharsan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/983.png',
  'DG Nalkande': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/304.png',
  'J Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/98.png',
  'Mohit Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/93.png',
  'Noor Ahmad': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/998.png',
  'R Sai Kishore': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/451.png',
  'Shivam Mavi': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/238.png',
  'Yash Dayal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/986.png',
  'Abdul Samad': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/448.png',
  'Kartik Tyagi': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/447.png',
  'Abhishek Porel': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1013.png',
  'PJ Sangwan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/40.png',
  'Rilee Rossouw': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/209.png',
  'Sarfaraz Khan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/133.png',
  'Yash Dhull': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/979.png',
  'AT Rayudu': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5.png',
  'Simarjeet Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/621.png',
  'TU Deshpande': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/452.png',
  'M Markande': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/235.png',
  'A Manohar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/985.png',
  'Shakib Al Hasan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/66.png',
  'Litton Das': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1012.png',
  'N Jagadeesan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/236.png',
  'Vaibhav Arora': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/619.png',
  'Mohsin Khan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/987.png',
  'Naveen-ul-Haq': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1009.png',
  'Yudhvir Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/453.png',
  'Akash Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/449.png',
  'Arjun Tendulkar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/617.png',
  'Hrithik Shokeen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/988.png',
  'Nehal Wadhera': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1008.png',
  'Vishnu Vinod': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/135.png',
  'Baltej Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/989.png',
  'Vidwath Kaverappa': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1015.png',
  'R Dhawan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/95.png',
  'KC Cariappa': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/132.png',
  'Sandeep Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/94.png',
  'NA Saini': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/107.png',
  'KM Jadhav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/84.png',
  'M Jansen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/634.png',
  'Vivrant Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1016.png',
  'T Stubbs': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/969.png',
  'Mukesh Kumar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1019.png',
  'I Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/38.png',
  'PD Salt': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1018.png',
  'Manish Pandey': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/17.png',
  'Vyshak Vijay Kumar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1020.png',
  'Wayne Parnell': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/70.png',
  'Akash Madhwal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/990.png',
  'Kumar Kartikeya': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/991.png',
  'Jason Roy': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/193.png',
  'Suyash Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1017.png',
  'Chris Jordan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/192.png',
  'Raghav Goyal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1021.png',
  'Joe Root': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1022.png',
  'Shubham Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/454.png',
  'Dewald Brevis': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/967.png',
  'Tristan Stubbs': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/969.png',
  'Tim David': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/636.png',
  'Cameron Green': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1007.png',
  'Jason Behrendorff': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/511.png',
  'Riley Meredith': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/638.png',
  'Piyush Chawla': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/7.png',
  'Kumar Kartikeya Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/991.png',
  'Jofra Archer': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/181.png',
  'Arshad Khan': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/992.png',
  'Ramandeep Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/993.png',
  'Shams Mulani': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/994.png',
  'Duan Jansen': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/995.png',
  'Jhye Richardson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/510.png',
  'Prashant Chopra': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/137.png',
  'Sandeep Warrier': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/109.png',
  'Anmolpreet Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/307.png',
  'Mayank Dagar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/305.png',
  'Adil Rashid': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/147.png',
  'Akeal Hosein': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/996.png',
  'Glenn Phillips': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/631.png',
  'Upendra Singh Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/999.png',
  'Nitish Kumar Reddy': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1000.png',
  'Sanvir Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1001.png',
  'Samarth Vyas': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1002.png',
  'Anmolpreet Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/307.png',
  'Phil Salt': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1018.png',
  'Ripal Patel': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/590.png',
  'Praveen Dubey': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/442.png',
  'Vicky Ostwal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1003.png',
  'Manish Pandey': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/17.png',
  'Ben Stokes': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/177.png',
  'Dwaine Pretorius': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/562.png',
  'Ajinkya Rahane': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/4.png',
  'Shaik Rasheed': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1004.png',
  'Nishant Sindhu': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1005.png',
  'Ajay Mandal': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1006.png',
  'Bhagath Varma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/620.png',
  'Kyle Jamieson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/557.png',
  'Prashant Solanki': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/996.png',
  'Subhranshu Senapati': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/997.png',
  'Mukesh Choudhary': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/998.png',
  'David Willey': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/208.png',
  'Reece Topley': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/507.png',
  'Rajan Kumar': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1007.png',
  'Avinash Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1008.png',
  'Sonu Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1009.png',
  'Manoj Bhandage': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1010.png',
  'Himanshu Sharma': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1011.png',
  'Will Jacks': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1012.png',
  'Sikandar Raza': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1013.png',
  'Shivam Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1014.png',
  'Mohit Rathee': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1015.png',
  'Donovan Ferreira': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1016.png',
  'Kunal Rathore': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1017.png',
  'Abdul Basith': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1018.png',
  'Akash Vasisht': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1019.png',
  'Murugan Ashwin': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/31.png',
  'Adam Zampa': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/149.png',
  'KM Asif': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/234.png',
  'Odean Smith': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/639.png',
  'Urvil Patel': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1020.png',
  'KS Williamson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/47.png',
  'Joshua Little': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1011.png',
  'Alzarri Joseph': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/508.png',
  'Dasun Shanaka': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1021.png',
  'Harshit Rana': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/999.png',
  'Anukul Roy': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/239.png',
  'Lockie Ferguson': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/163.png',
  'Tim Southee': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/184.png',
  'Umesh Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/43.png',
  'Varun Chakaravarthy': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/308.png',
  'Shardul Thakur': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/105.png',
  'Mandeep Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/13.png',
  'Johnson Charles': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1022.png',
  'Romario Shepherd': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/968.png',
  'Prerak Mankad': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/130.png',
  'Swapnil Singh': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/34.png',
  'Daniel Sams': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/509.png',
  'Amit Mishra': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/30.png',
  'Karun Nair': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/16.png',
  'Jaydev Unadkat': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/86.png',
  'Manan Vohra': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/100.png',
  'Mark Wood': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/506.png',
  'Mayank Yadav': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1023.png',
  'default': 'https://ionicframework.com/docs/img/demos/avatar.svg'
};

const teamColors = {
  'Royal Challengers Bangalore': '#EC1C24',
  'Chennai Super Kings': '#FDB913',
  'Mumbai Indians': '#004B8D',
  'Kolkata Knight Riders': '#3A225D',
  'Sunrisers Hyderabad': '#F26522',
  'Delhi Capitals': '#00008B',
  'Punjab Kings': '#DD1F2D',
  'Rajasthan Royals': '#00489B',
  'Lucknow Super Giants': '#00AEEF',
  'Gujarat Titans': '#1B2133'
};

const PlayerCard = ({ player, delay }) => {
  const playerName = player.Player_Name.trim();
  const playerImage = playerImages[playerName] || playerImages['default'];
  
  const getTeamFullName = (teamShortName) => {
    if (!teamShortName) return 'Unknown Team';
    const team = Object.entries(teamColors).find(([fullName, color]) => fullName.toLowerCase().includes(teamShortName.toLowerCase()));
    return team ? team[0] : teamShortName;
  };

  const teamFullName = getTeamFullName(player.Team);
  const playerTeamColor = teamColors[teamFullName] || '#757575';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 }}
      whileHover={{ y: -8, boxShadow: `0 15px 30px -10px ${playerTeamColor}` }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 20px -8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        fontFamily: "'Roboto', sans-serif",
        color: '#1f2937',
      }}
    >
      <div style={{
        height: '120px',
        background: `linear-gradient(45deg, ${playerTeamColor}, ${playerTeamColor}d0)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <img
          src={playerImage}
          alt={playerName}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '4px solid white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            objectFit: 'cover'
          }}
          onError={(e) => { e.target.src = playerImages['default']; }}
        />
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.3em',
          fontWeight: 700,
          color: '#111827'
        }}>{playerName}</h3>
        <p style={{
          margin: 0,
          fontSize: '0.95em',
          color: playerTeamColor,
          fontWeight: 600
        }}>{teamFullName}</p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div>
            <p style={{ margin: '0', fontSize: '0.8em', color: '#6b7280' }}>Role</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 600, fontSize: '1em' }}>{player.Batting_Type || 'N/A'}</p>
          </div>
          <div>
            <p style={{ margin: '0', fontSize: '0.8em', color: '#6b7280' }}>Nationality</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 600, fontSize: '1em' }}>{player.Country || 'N/A'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("Player_Name");

  useEffect(() => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/players")
      .then(res => {
        setPlayers(res.data.players || []);
        setLoading(false);
      })
      .catch(() => {
        setPlayers([]);
        setLoading(false);
      });
  }, []);

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter(player => player.Player_Name?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      });
  }, [players, search, sort]);

  const topPlayersByNationality = useMemo(() => {
    const counts = players.reduce((acc, player) => {
      const nat = player.Nationality || 'Unknown';
      acc[nat] = (acc[nat] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [players]);

  const chartData = {
    labels: topPlayersByNationality.map(([nat]) => nat),
    datasets: [{
      label: 'Number of Players',
      data: topPlayersByNationality.map(([, count]) => count),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div style={{
      padding: "40px 20px",
      minHeight: "100vh",
      background: "transparent"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h1 style={{
            fontSize: '3.5em',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px'
          }}>IPL Player Universe</h1>
          <p style={{
            fontSize: '1.2em',
            color: '#cccccc',
            marginTop: '10px'
          }}>Explore the profiles of every player in the league.</p>
        </motion.div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: "relative", flexGrow: 1, maxWidth: "600px" }}>
            <input
              type="text"
              placeholder="Search for a player..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 20px 15px 50px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                fontSize: "16px",
                background: "#fff",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s",
                outline: "none",
              }}
            />
            <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>
              🔍
            </span>
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: "15px 20px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              fontSize: "16px",
              background: "#fff",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
              cursor: 'pointer'
            }}
          >
            <option value="Player_Name">Sort by Name</option>
            <option value="Team">Sort by Team</option>
            <option value="Nationality">Sort by Nationality</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.2em', color: '#4b5563' }}>Loading players...</div>
        ) : (
          <>
            {filteredAndSortedPlayers.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "30px"
              }}>
                {filteredAndSortedPlayers.map((player, idx) => (
                  <PlayerCard key={player.Player_ID || idx} player={player} delay={idx} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.5em', color: '#1f2937' }}>No players found</h3>
                <p style={{ color: '#6b7280' }}>Try adjusting your search or sort criteria.</p>
              </div>
            )}
          </>
        )}

        {!loading && players.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ marginTop: '60px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 8px 20px -8px rgba(0, 0, 0, 0.1)' }}
          >
            <h2 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '30px' }}>Player Nationality Distribution</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Players;