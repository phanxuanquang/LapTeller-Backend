**© 2023 University of Information Technology / LapTeller Project**
------------
![alt text](https://i.imgur.com/pXOoTDe.jpeg)
## 0. Our team:
| NO. | NAME | RESPONSIBILITY |
| --- | --- | --- |
| 1 | [Phan Xuan Quang](https://github.com/phanxuanquang "Phan Xuân Quang") | Backend Development, AI Model Fine-Tuning, DevOps |
| 2 | [Bui Minh Tuan](https://github.com/tuan20520342 "Bùi Minh Tuấn") | Web Application Development |
| 3 | [Din Hien Dung](https://github.com/dung-ovl "Dín Hiền Dũng") | Mobile Application Development |
## 1. Overview
### 1.1. The use cases:

- **Information Overload:** The vast selection of laptop models and specifications can be overwhelming for many users, making it difficult to choose the right one.
- **Lack of Technical Knowledge:** Many users may not possess the technical expertise to understand the intricacies of laptop hardware and software, making it challenging to make informed purchasing decisions.
- **Troubleshooting Difficulties:** Laptop users may encounter various issues and problems, such as software glitches, hardware malfunctions, and connectivity problems, which can be frustrating and time-consuming to resolve.
- **Outdated Information:** The rapid pace of technological advancements means that laptop information can quickly become outdated, making it difficult for users to stay informed about the latest models and features.
- **Biased Reviews:** Traditional review platforms may contain biased or sponsored reviews, making it challenging for users to find genuine and trustworthy recommendations.
- **Lack of Personalized Advice:** Generic buying guides may not cater to the specific needs and preferences of individual users, leading to dissatisfaction with their purchases.

### 1.2. Our solution:
With the ultimate goal is to help non-tech people to choose a suitable laptop for their need and their budget, LapTeller is created to provide:
- Comprehensive information about various aspects of laptops, including hardware components, operating systems, and software applications, empowering users to make informed decisions.
- Clear and easy-to-understand explanations, making it accessible to users of all technical backgrounds.
- Comparative analysis and reviews, helping users identify the best options based on their specific needs and preferences.
- Troubleshooting assistance for common laptop issues, guiding users through the necessary steps to resolve problems quickly and efficiently.
- Regularly updated content about laptop market, keeping them informed about new releases and technological advancements.
- Personalized recommendations based on users' unique requirements and budget, helping them find the laptop that best suits their individual needs.
- Buiding guidance that provide readers with all the essential information they need to consider when purchasing a new laptop. This can include factors such as budget, performance requirements, and desired features.

## 2. Re-building Guidance
A brief of step-by-step command lines to re-build LapTeller project.
### 2.1. Set up project:

Step 1. Install Node.js and npm (skip if you had it already):

- [**Node.js**](https://nodejs.org/en/download/package-manager)
- [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Step 2: Clone repository for backend.
```console
git clone https://github.com/phanxuanquang/LapTeller-Backend
```

Step 2: Clone sub-module for frontend.
```console
cd LapTeller-Backend
```
```console
git submodule update --init --recursive
```

Step 3: Install Node.js modules for backend project.
```console
npm i
```

Step 4: Install Node.js modules for frontend project.
```console
cd lapteller
```
```console
npm i
```
### 2.2. Usage:
##### 2.2.1. Start Node.js server:
```console
node LapTeller.js
```
##### 2.2.1. Start React application:
```console
cd lapteller
```
```console
npm start
```
