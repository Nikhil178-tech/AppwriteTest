import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

export default async ({ req, res, log, error }) => {
  try {
    log(JSON.parse(req.body))
    const { accessKey, secretKey, bucketName } = JSON.parse(req.body);

    // Validate input
    if (!accessKey || !secretKey || !bucketName) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: "us-east-1", // Replace with your AWS region
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    // Test connection by listing buckets
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    

    const bucketExists = response.Buckets?.some(
      (bucket) => bucket.Name === bucketName
    );

    if (!bucketExists) {
      return res.json({ success: false, message: "Bucket not found" });
    }

    // Simulate connection steps
    const steps = [
      { id: 1, label: "Validating credentials", completed: true },
      { id: 2, label: "Establishing connection", completed: true },
      { id: 3, label: "Testing permissions", completed: true },
      { id: 4, label: "Finalizing setup", completed: true },
    ];

    return res.json({ success: true, steps,response });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, message: err.message });
  }
};