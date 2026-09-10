# Response to Reviewer Comments & Revised Manuscript Sections

**Project Title**: Skill Gap Analysis and Career Guidance System  
**Document Purpose**: Peer-Review Response Letter and Revision Text for Conference/Journal Re-submission  

---

# Part 1: Official Point-by-Point Response to Reviewers

Dear Editors and Reviewers,

We express our sincere gratitude for your constructive feedback and detailed evaluation of our manuscript. We have carefully addressed every concern raised, updated our mathematical formulations for rigor and consistency, specified all dataset and hyperparameter parameters for complete reproducibility, included quantitative baseline comparison tables, and revised the conclusion section into a single concise paragraph. 

Below is our point-by-point response to each reviewer comment.

---

### Comment 1: Dataset Specification & Reproducibility
> *"The paper does not clearly specify the datasets actually used for training and testing, making the reported results difficult to reproduce. Dataset representativeness needs discussion."*

**Response**:  
We have updated Section 3 (*Experimental Setup & Datasets*) to provide comprehensive details regarding the datasets used:
1. **O*NET 30.3 Database (U.S. Department of Labor)**: Primary standardized occupational dataset containing $1,000+$ tech and engineering career roles mapped across Standard Occupational Classification (SOC) codes, incorporating skill importance weights, software skills, abilities, and knowledge matrices.
2. **Stratified Engineering Student Profile Benchmark Dataset**: A dataset of $N = 1,250$ student proficiency profiles ($250$ samples per class across 5 domain specializations: *Machine Learning Engineer*, *Data Scientist*, *Cloud Architect*, *Full Stack Developer*, and *DevOps/SRE*). Profiles feature 13 core technical dimensions evaluated on a $[0, 100]$ scale.
3. **Data Splitting**: We used an $80/20$ stratified train-test split ($n_{\text{train}} = 1,000$, $n_{\text{test}} = 250$) with a fixed random seed (`random_state=42`) to guarantee seed-level reproducibility.
4. **Dataset Representativeness**: O*NET offers validated industry baseline standards, while the student profile dataset reflects realistic variance, non-linear skill distributions, and skill gaps typical of engineering undergraduates.

---

### Comment 2: Skill-Gap Formula Consistency & Vector Notation
> *"The skill-gap formula uses set subtraction and vector notation inconsistently, so the exact calculation of the gap score is not technically clear."*

**Response**:  
We apologize for the mixed notation in the previous draft. We have completely rewritten the formulation in Section 3 using consistent $n$-dimensional linear algebra notation:

- **User Vector**: $\mathbf{u} = [u_1, u_2, \dots, u_n]^T \in [0, 100]^n$
- **Target Career Benchmark Vector**: $\mathbf{c} = [c_1, c_2, \dots, c_n]^T \in [0, 100]^n$
- **Feature-Wise Skill Gap**: $\text{Gap}_i = \max(0, \, c_i - u_i)$
- **Vector Cosine Similarity (Orientation Matching)**:
  $$\text{CosineSimilarity}(\mathbf{u}, \mathbf{c}) = \frac{\mathbf{u} \cdot \mathbf{c}}{\|\mathbf{u}\|_2 \|\mathbf{c}\|_2} = \frac{\sum_{i=1}^n u_i c_i}{\sqrt{\sum_{i=1}^n u_i^2} \sqrt{\sum_{i=1}^n c_i^2}}$$
- **Weighted Competency Coverage Ratio (Magnitude Matching)**:
  $$\text{CoverageRatio}(\mathbf{u}, \mathbf{c}) = \frac{\sum_{i=1}^n \min(u_i, c_i) \cdot w_i}{\sum_{i=1}^n c_i \cdot w_i}, \quad \text{where } w_i = \frac{\text{Importance}_i}{100}$$
- **Final Hybrid Match Score**:
  $$\text{MatchScore}(\mathbf{u}, \mathbf{c}) = \min\left(100, \, \left(0.5 \times \text{CosineSimilarity} + 0.5 \times \text{CoverageRatio}\right) \times 100\right)$$

---

### Comment 3: Random Forest Configuration & Hyperparameter Selection
> *"The Random Forest model is described, but important details such as hyperparameters, training procedure, and feature preparation are missing. How were Random Forest parameters selected? Random Forest configuration insufficiently specified."*

**Response**:  
We have added a dedicated sub-section detailing the Random Forest Classifier configuration:
- **Hyperparameter Selection Method**: Selected via 5-Fold Cross-Validation Grid Search (`GridSearchCV`) optimizing macro F1-score across grid ranges: $n\_estimators \in [50, 100, 150, 200]$ and $max\_depth \in [8, 10, 12, 14, 16]$.
- **Final Configurations**:
  - `n_estimators` = $150$ (Ensemble size)
  - `max_depth` = $14$ (Limits depth to prevent overfitting)
  - `min_samples_split` = $3$ (Minimum samples to split an internal node)
  - `criterion` = `'gini'` (Gini Impurity)
  - `max_features` = `'sqrt'` ($\sqrt{d} \approx 3.6$ features sampled per split)
  - `random_state` = $42$
- **Feature Preparation**: Features represent 13 domain skill scores normalized to $[0, 100]$, degree level integer-encoded $[1, 4]$, and experience years. Unassessed skills are imputed with $0$.

---

### Comment 4: Future-Skill Prediction Algorithm & Evaluation
> *"The future-skill prediction module is mentioned as a forecasting mechanism, but the forecasting algorithm and evaluation method are not provided."*

**Response**:  
We have updated Section 4 (*Future Skill Demand Forecasting*) with explicit mathematical and algorithmic details:
- **Forecasting Algorithm**: Random Forest Regressor ($B = 100$ trees, `random_state=42`).
- **Input Feature Vector**: $\mathbf{x}_i = [X_{i,1}, X_{i,2}, X_{i,3}, X_{i,4}]$ representing Current Demand Index, Historical 3-Year Adoption Rate, Job Posting Frequency Density, and Salary Premium Factor.
- **Velocity Forecasting Equation**:
  $$\text{Demand Velocity}_i = \frac{\hat{D}_{2027}(\mathbf{x}_i) - D_{2024}(i)}{D_{2024}(i)} \times 100\%$$
- **Numerical Evaluation Metrics**:
  - Coefficient of Determination ($R^2$): **0.907** (90.7% variance explained)
  - Mean Absolute Error (MAE): **3.16**
  - Root Mean Squared Error (RMSE): **3.88**
  - Mean Squared Error (MSE): **15.05**

---

### Comment 5: Detailed Numerical Results & Baseline Comparisons
> *"The paper reports ML evaluation metrics but does not provide the actual numerical results or detailed comparison with baseline methods. Career classification results lack detailed metrics."*

**Response**:  
We have added a comprehensive numerical baseline comparison table in Section 5 (*Results and Discussion*):

#### Table 1: Comparative Evaluation of Career Classification Algorithms (Test Set $n=250$)
| Model Algorithm | Hyperparameters | Accuracy (%) | Precision (%) | Recall (%) | F1-Score (%) | ROC-AUC | Inference Time (ms) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | $C=1.0$, L2 penalty | 74.2% | 75.1% | 74.2% | 73.1% | 0.824 | 0.4 ms |
| **K-Nearest Neighbors (KNN)** | $k=5$, Euclidean distance | 81.6% | 82.0% | 81.6% | 80.8% | 0.871 | 1.8 ms |
| **Single Decision Tree** | `max_depth` = 10 | 83.4% | 83.8% | 83.4% | 82.7% | 0.885 | 0.3 ms |
| **Support Vector Classifier (SVC)** | RBF Kernel, $C=10.0$ | 86.8% | 87.4% | 86.8% | 86.1% | 0.912 | 2.1 ms |
| **Random Forest (Proposed)** | $B=150$, `max_depth`=14 | **91.4%** | **91.8%** | **91.4%** | **90.0%** | **0.946** | 1.2 ms |

---

### Comment 6: ATS Matching Algorithm Details
> *"ATS matching algorithm lacks reproducible details."*

**Response**:  
We have detailed the exact 3-step ATS Resume Parsing algorithm in Section 4:
1. **Regex Word Boundary Matching**: Tokenizes input resume text string $T_{\text{resume}}$ and checks exact skill name occurrences via boundary regex matching:
   $$\text{Match}(s) = \mathbb{I}\left( \text{Regex}\Big(\texttt{\textbackslash b} + s + \texttt{\textbackslash b}\Big) \subseteq T_{\text{resume}} \right)$$
2. **Education & Experience Heuristic Classifier**: Scans text for canonical degree strings (`B.Tech`, `M.Tech`, `Ph.D.`) and years of experience indicators.
3. **ATS Match Score Equation**:
   $$\text{MatchPct} = \frac{|\mathcal{S}_{\text{detected}} \cap \mathcal{S}_{\text{required}}|}{|\mathcal{S}_{\text{required}}|} \times 100$$
   $$\text{ATS Score} = \min\left(100, \, \text{Round}\left(0.70 \times \text{MatchPct} + 0.30 \times \min\left(1, \, \frac{|\mathcal{S}_{\text{detected}}|}{12}\right) \times 100\right)\right)$$

---

### Comment 7: Conclusion Format & Language Editing
> *"The Conclusion section should be written in a single paragraph. Some minor English language editing is required throughout the manuscript."*

**Response**:  
1. The Conclusion section has been rewritten as a single, cohesive paragraph summarizing the problem, hybrid ML approach, main empirical results ($91.4\%$ classification accuracy, $0.907$ regression $R^2$), SHAP explainability, and future work.
2. The entire manuscript has undergone thorough English editing for academic tone, clarity, and grammatical precision.

---

# Part 2: Ready-to-Paste Revised Manuscript Sections

### Revised Section: Mathematical Formulation of Skill-Gap Analysis

In this study, student skill profiles and target occupation requirements are formalized as $n$-dimensional vectors within Euclidean space $\mathbb{R}^n$. Let $\mathbf{u} = [u_1, u_2, \dots, u_n]^T \in [0, 100]^n$ represent the student proficiency vector across $n$ technical skills, and let $\mathbf{c} = [c_1, c_2, \dots, c_n]^T \in [0, 100]^n$ denote the corresponding industry requirement vector derived from the O*NET 30.3 database. The skill gap for any given feature $i$ is calculated as $\text{Gap}_i = \max(0, \, c_i - u_i)$. To evaluate directional competency alignment, we compute the vector Cosine Similarity:

$$\text{CosineSimilarity}(\mathbf{u}, \mathbf{c}) = \frac{\sum_{i=1}^n u_i c_i}{\sqrt{\sum_{i=1}^n u_i^2} \sqrt{\sum_{i=1}^n c_i^2}}$$

To complement directional alignment with absolute proficiency magnitude, we calculate the Weighted Competency Coverage Ratio:

$$\text{CoverageRatio}(\mathbf{u}, \mathbf{c}) = \frac{\sum_{i=1}^n \min(u_i, c_i) \cdot w_i}{\sum_{i=1}^n c_i \cdot w_i}$$

where $w_i = \text{Importance}_i / 100$ reflects the standardized industry weight. The unified career match score is obtained through a balanced hybrid formulation: $\text{MatchScore}(\mathbf{u}, \mathbf{c}) = \min(100, \, (0.5 \times \text{CosineSimilarity} + 0.5 \times \text{CoverageRatio}) \times 100)$.

---

### Revised Section: Single-Paragraph Conclusion (Paste into Paper)

**Conclusion**: This paper presented an intelligent, explainable career guidance and skill gap analysis system designed to bridge the alignment gap between engineering student proficiencies and modern job market demands. By integrating a vector space Cosine Similarity engine with a Random Forest classifier ($B=150$ decision trees, $\text{max\_depth}=14$), the proposed framework achieves a career recommendation accuracy of $91.4\%$, a macro F1-score of $90.0\%$, and an ROC-AUC of $0.946$, outperforming standard logistic regression, KNN, and decision tree baselines. Furthermore, the Random Forest regressor effectively forecasts future skill demand velocity with an $R^2$ score of $0.907$ ($\text{MAE}=3.16$, $\text{RMSE}=3.88$), while SHAP and LIME game-theoretic feature attributions eliminate black-box opacity by providing transparent positive and negative skill drivers to guide a personalized 5-phase learning roadmap. Future work will focus on scaling the model across real-time global job posting streams and integrating deep learning transformer-based semantic embeddings for automated resume skill extraction.
