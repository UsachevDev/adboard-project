package ru.atom.adboard.dal.repositories

import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.errors.MinioException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.apache.logging.log4j.LogManager
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Repository
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.io.InputStream
import java.util.*

@Repository
class ImageRepository(_minioClient: MinioClient, @Value("\${minio.bucket}") private val bucketName: String)
{
    private final val minioClient = _minioClient
    private final val logger = LogManager.getLogger(this.javaClass.name)
    fun saveImage(file: MultipartFile, announcementId: UUID) : String
    {
        return try {
                val bucketExistsArgs = BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build()
                if (!minioClient.bucketExists(bucketExistsArgs)) {
                    val makeBucketArgs = MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build()
                    minioClient.makeBucket(makeBucketArgs)
                }

                val fileName = "${announcementId}/${file.originalFilename}"
                val inputStream: InputStream = file.inputStream
                minioClient.putObject(
                    PutObjectArgs.builder()
                        .bucket(bucketName)
                        .`object`(fileName)
                        .stream(inputStream, file.size, -1)
                        .contentType(file.contentType)
                        .build()
                )
                generatePublicUrl(fileName)
            } catch (e: MinioException) {
                logger.error("MinIO error while uploading file: ${e.message}", e)
                throw RuntimeException("Failed to upload file to MinIO: ${e.message}", e)
            } catch (e: IOException) {
                logger.error("IO error while uploading file: ${e.message}", e)
                throw RuntimeException("Failed to read file: ${e.message}", e)
            } catch (e: Exception) {
                logger.error("Unexpected error while uploading file: ${e.message}", e)
                throw RuntimeException("Unexpected error during upload: ${e.message}", e)
            }

    }

    fun generatePublicUrl(objectName: String): String {
        return "http://localhost:9000/${bucketName}/${objectName}" // Прямой URL для общедоступного доступа
    }
}
