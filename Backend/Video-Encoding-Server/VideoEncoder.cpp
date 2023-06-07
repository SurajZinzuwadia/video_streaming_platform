#include <iostream>
#include <string>
#include <cstdlib>

extern "C" {
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavutil/opt.h>
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <input_file> <output_file>" << std::endl;
        return 1;
    }

    const std::string inputFilename = argv[1];
    const std::string outputFilename = argv[2];

    av_register_all();

    // Open the input file
    AVFormatContext* inputFormatContext = nullptr;
    if (avformat_open_input(&inputFormatContext, inputFilename.c_str(), nullptr, nullptr) != 0) {
        std::cerr << "Failed to open input file: " << inputFilename << std::endl;
        return 1;
    }

    // Retrieve input stream information
    if (avformat_find_stream_info(inputFormatContext, nullptr) < 0) {
        std::cerr << "Failed to find stream information" << std::endl;
        avformat_close_input(&inputFormatContext);
        return 1;
    }

    // Find the video stream
    AVCodec* codec = nullptr;
    int videoStreamIndex = -1;
    for (unsigned int i = 0; i < inputFormatContext->nb_streams; i++) {
        if (inputFormatContext->streams[i]->codecpar->codec_type == AVMEDIA_TYPE_VIDEO) {
            videoStreamIndex = i;
            codec = avcodec_find_decoder(inputFormatContext->streams[i]->codecpar->codec_id);
            break;
        }
    }

    if (videoStreamIndex == -1) {
        std::cerr << "Failed to find video stream in the input file" << std::endl;
        avformat_close_input(&inputFormatContext);
        return 1;
    }

    // Allocate a codec context for the decoder
    AVCodecContext* codecContext = avcodec_alloc_context3(codec);
    if (!codecContext) {
        std::cerr << "Failed to allocate codec context" << std::endl;
        avformat_close_input(&inputFormatContext);
        return 1;
    }

    // Copy codec parameters to the codec context
    if (avcodec_parameters_to_context(codecContext, inputFormatContext->streams[videoStreamIndex]->codecpar) < 0) {
        std::cerr << "Failed to copy codec parameters to codec context" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        return 1;
    }

    // Open the codec
    if (avcodec_open2(codecContext, codec, nullptr) < 0) {
        std::cerr << "Failed to open codec" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        return 1;
    }

    // Create an output format context
    AVFormatContext* outputFormatContext = nullptr;
    if (avformat_alloc_output_context2(&outputFormatContext, nullptr, nullptr, outputFilename.c_str()) < 0) {
        std::cerr << "Failed to allocate output format context" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        return 1;
    }

    // Find the encoder for H.265
    AVCodec* outputCodec = avcodec_find_encoder_by_name("libx265");
    if (!outputCodec) {
        std::cerr << "Failed to find H.265 encoder" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Create a new video stream in the output format context
    AVStream* outputVideoStream = avformat_new_stream(outputFormatContext, outputCodec);
    if (!outputVideoStream) {
        std::cerr << "Failed to create output video stream" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Copy codec parameters from the input video stream to the output video stream
    if (avcodec_parameters_copy(outputVideoStream->codecpar, inputFormatContext->streams[videoStreamIndex]->codecpar) < 0) {
        std::cerr << "Failed to copy codec parameters to output video stream" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Set the output codec context parameters
    AVCodecContext* outputCodecContext = avcodec_alloc_context3(outputCodec);
    if (!outputCodecContext) {
        std::cerr << "Failed to allocate output codec context" << std::endl;
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    outputCodecContext->codec_id = outputCodec->id;
    outputCodecContext->codec_type = AVMEDIA_TYPE_VIDEO;
    outputCodecContext->pix_fmt = AV_PIX_FMT_YUV420P;
    outputCodecContext->width = codecContext->width;
    outputCodecContext->height = codecContext->height;
    outputCodecContext->bit_rate = 1000000;  // Adjust the bit rate as desired
    outputCodecContext->gop_size = 10;       // Adjust the GOP size as desired

    // Open the output codec
    if (avcodec_open2(outputCodecContext, outputCodec, nullptr) < 0) {
        std::cerr << "Failed to open output codec" << std::endl;
        avcodec_free_context(&outputCodecContext);
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Allocate frame buffers
    AVFrame* frame = av_frame_alloc();
    AVFrame* outputFrame = av_frame_alloc();
    if (!frame || !outputFrame) {
        std::cerr << "Failed to allocate frame buffers" << std::endl;
        av_frame_free(&outputFrame);
        av_frame_free(&frame);
        avcodec_free_context(&outputCodecContext);
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Determine the required buffer size and allocate the buffer
    const int bufferSize = av_image_get_buffer_size(outputCodecContext->pix_fmt, outputCodecContext->width, outputCodecContext->height, 32);
    uint8_t* buffer = (uint8_t*)av_malloc(bufferSize);
    if (!buffer) {
        std::cerr << "Failed to allocate buffer" << std::endl;
        av_free(outputFrame);
        av_free(frame);
        avcodec_free_context(&outputCodecContext);
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Set the frame buffer pointers to the allocated buffer
    av_image_fill_arrays(outputFrame->data, outputFrame->linesize, buffer, outputCodecContext->pix_fmt, outputCodecContext->width, outputCodecContext->height, 32);

    // Initialize the output format context with the output file
    if (!(outputFormatContext->oformat->flags & AVFMT_NOFILE)) {
        if (avio_open(&outputFormatContext->pb, outputFilename.c_str(), AVIO_FLAG_WRITE) < 0) {
            std::cerr << "Failed to open output file: " << outputFilename << std::endl;
            av_free(buffer);
            av_free(outputFrame);
            av_free(frame);
            avcodec_free_context(&outputCodecContext);
            avcodec_free_context(&codecContext);
            avformat_close_input(&inputFormatContext);
            avformat_free_context(outputFormatContext);
            return 1;
        }
    }

    // Write the output format header to the output file
    if (avformat_write_header(outputFormatContext, nullptr) < 0) {
        std::cerr << "Failed to write output format header" << std::endl;
        avio_closep(&outputFormatContext->pb);
        av_free(buffer);
        av_free(outputFrame);
        av_free(frame);
        avcodec_free_context(&outputCodecContext);
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Initialize the packet used to store encoded data
    AVPacket* packet = av_packet_alloc();
    if (!packet) {
        std::cerr << "Failed to allocate packet" << std::endl;
        avio_closep(&outputFormatContext->pb);
        av_free(buffer);
        av_free(outputFrame);
        av_free(frame);
        avcodec_free_context(&outputCodecContext);
        avcodec_free_context(&codecContext);
        avformat_close_input(&inputFormatContext);
        avformat_free_context(outputFormatContext);
        return 1;
    }

    // Read frames from the input file and encode them
    while (av_read_frame(inputFormatContext, packet) >= 0) {
        if (packet->stream_index == videoStreamIndex) {
            // Decode the frame from the input packet
            avcodec_send_packet(codecContext, packet);
            avcodec_receive_frame(codecContext, frame);

            // Convert the frame format to the output format
            sws_scale(sws_getContext(codecContext->width, codecContext->height, codecContext->pix_fmt,
                                    codecContext->width, codecContext->height, AV_PIX_FMT_YUV420P,
                                    SWS_BICUBIC, nullptr, nullptr, nullptr),
                      frame->data, frame->linesize, 0, codecContext->height, outputFrame->data, outputFrame->linesize);

            // Set the PTS and DTS for the output frame
            outputFrame->pts = av_rescale_q(frame->pts, inputFormatContext->streams[videoStreamIndex]->time_base, outputFormatContext->streams[videoVideoStreamIndex]->time_base);
            outputFrame->pkt_dts = av_rescale_q(frame->pkt_dts, inputFormatContext->streams[videoStreamIndex]->time_base, outputFormatContext->streams[videoStreamIndex]->time_base);

            // Encode the frame to the output packet
            avcodec_send_frame(outputCodecContext, outputFrame);
            while (avcodec_receive_packet(outputCodecContext, packet) == 0) {
                // Rescale the packet timestamps
                packet->pts = av_rescale_q_rnd(packet->pts, outputCodecContext->time_base, outputFormatContext->streams[videoStreamIndex]->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
                packet->dts = av_rescale_q_rnd(packet->dts, outputCodecContext->time_base, outputFormatContext->streams[videoStreamIndex]->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
                packet->duration = av_rescale_q(packet->duration, outputCodecContext->time_base, outputFormatContext->streams[videoStreamIndex]->time_base);
                packet->stream_index = videoStreamIndex;

                // Write the encoded packet to the output file
                av_write_frame(outputFormatContext, packet);
                av_packet_unref(packet);
            }
        }

        av_packet_unref(packet);
    }

    // Flush the encoder
    avcodec_send_frame(outputCodecContext, nullptr);
    while (avcodec_receive_packet(outputCodecContext, packet) == 0) {
        // Rescale the packet timestamps
        packet->pts = av_rescale_q_rnd(packet->pts, outputCodecContext->time_base, outputFormatContext->streams[videoStreamIndex]->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
        packet->dts = av_rescale_q_rnd(packet->dts, outputCodecContext->time_base, outputFormatContext->streams[videoStreamIndex]->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
        packet->duration = av_rescale_q(packet->duration, outputCodecContext->time_base, outputFormatContext->streams[videoStreamIndex]->time_base);
        packet->stream_index = videoStreamIndex;

        // Write the encoded packet to the output file
        av_write_frame(outputFormatContext, packet);
        av_packet_unref(packet);
    }

    // Write the output format trailer to the output file
    av_write_trailer(outputFormatContext);

    // Clean up resources
    avio_closep(&outputFormatContext->pb);
    av_free(buffer);
    av_free(outputFrame);
    av_free(frame);
    av_packet_free(&packet);
    avcodec_free_context(&outputCodecContext);
    avcodec_free_context(&codecContext);
    avformat_close_input(&inputFormatContext);
    avformat_free_context(outputFormatContext);

    return 0;
}
