from pyspark.sql import SparkSession
from pyspark.sql.functions import min, max, avg
from pyspark.sql.types import StructType, StructField, StringType, DoubleType

spark = SparkSession.builder \
    .appName("FinancialTransactions") \
    .config("spark.jars", "postgresql-42.7.3.jar") \
    .getOrCreate()

schema = StructType([
    StructField("timestamp", StringType(), True),
    StructField("branch_code", StringType(), True),
    StructField("amount", DoubleType(), True)
])

# Extract
df = spark.read.csv('../util/financial_transactions.csv', header=True, schema=schema)

# Transform
result = df.groupBy("branch_code").agg(
    min("amount").alias("min_amount"),
    max("amount").alias("max_amount"),
    avg("amount").alias("avg_amount")
)

# Load
result.write.mode("overwrite").format("jdbc").option("url", "jdbc:postgresql://localhost:5432/versapay") \
    .option("dbtable", "branch_statistics") \
    .option("user", "versapay") \
    .option("password", "versapay") \
    .save()

spark.stop()
